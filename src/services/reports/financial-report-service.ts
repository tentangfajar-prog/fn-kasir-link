import type { Prisma, StockDirection, WarungCashAccount } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { permissionService } from "@/services/permissions/permission-service";
import { reportFilterSchema } from "@/lib/validations/reports";
import type { AuthContext } from "@/types/auth";

type DateFilter = { gte?: Date; lte?: Date };

type LedgerRow = { direction: StockDirection; amount: bigint };
type WarungCashLedgerRow = LedgerRow & { account: WarungCashAccount };

function toDateFilter(from?: string, to?: string): DateFilter | undefined {
  if (!from && !to) return undefined;
  return { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };
}

function money(value: bigint) {
  return value.toString();
}

function ledgerSum(rows: LedgerRow[]) {
  return rows.reduce((total, row) => total + (row.direction === "IN" ? row.amount : -row.amount), BigInt(0));
}

export class FinancialReportService {
  async getSummary(ctx: AuthContext, input: unknown = {}) {
    this.requireReport(ctx);
    const filter = reportFilterSchema.parse(input);
    const dateFilter = toDateFilter(filter.date_from, filter.date_to);
    const [assetLiquidity, debtAndPayables, warungProfit, brilinkRevenue, warungStockValue] = await Promise.all([
      this.getAssetLiquidity(ctx, input),
      this.getDebtAndPayables(ctx, input),
      this.warungProfit(dateFilter),
      this.brilinkRevenue(dateFilter),
      this.warungStockValue(),
    ]);

    const totalRevenue = warungProfit.omzet + brilinkRevenue.fee_net;
    const totalProfit = warungProfit.profit + brilinkRevenue.fee_net;
    const warungNet = BigInt(assetLiquidity.kas_laci) + BigInt(assetLiquidity.kas_aman) + warungStockValue - BigInt(debtAndPayables.hutang_supplier);
    const brilinkNet = BigInt(assetLiquidity.cash_brilink) + BigInt(assetLiquidity.saldo_brilink) + BigInt(debtAndPayables.dana_luar_aktif) - BigInt(debtAndPayables.injeksi_aktif);

    return {
      total_pendapatan_operasional: money(totalRevenue),
      total_profit_operasional: money(totalProfit),
      total_aset_likuid: assetLiquidity.total_aset_likuid,
      total_modal_tercatat: "0",
      total_kewajiban: debtAndPayables.total_kewajiban,
      estimasi_bersih_warung: money(warungNet),
      estimasi_dana_bersih_brilink: money(brilinkNet),
    };
  }

  async getAssetLiquidity(ctx: AuthContext, input: unknown = {}) {
    this.requireReport(ctx);
    reportFilterSchema.parse(input);
    const [warungCash, brilinkCash, brilinkSaldo] = await Promise.all([
      prisma.warungCashLedger.findMany({ select: { account: true, direction: true, amount: true } }),
      prisma.brilinkCashLedger.findMany({ select: { direction: true, amount: true } }),
      prisma.brilinkSaldoLedger.findMany({ select: { direction: true, amount: true } }),
    ]);
    const kasLaci = this.warungCashBalance(warungCash, "KAS_LACI");
    const kasAman = this.warungCashBalance(warungCash, "KAS_AMAN");
    const cashBrilink = ledgerSum(brilinkCash);
    const saldoBrilink = ledgerSum(brilinkSaldo);
    return {
      kas_laci: money(kasLaci),
      kas_aman: money(kasAman),
      cash_brilink: money(cashBrilink),
      saldo_brilink: money(saldoBrilink),
      total_aset_likuid: money(kasLaci + kasAman + cashBrilink + saldoBrilink),
    };
  }

  async getMatchingKasModal(ctx: AuthContext, input: unknown = {}) {
    this.requireReport(ctx);
    const [assetLiquidity, debtAndPayables] = await Promise.all([
      this.getAssetLiquidity(ctx, input),
      this.getDebtAndPayables(ctx, input),
    ]);
    return {
      warung: { kas_laci: assetLiquidity.kas_laci, kas_aman: assetLiquidity.kas_aman, hutang_supplier: debtAndPayables.hutang_supplier },
      brilink: { cash: assetLiquidity.cash_brilink, saldo: assetLiquidity.saldo_brilink, dana_luar_aktif: debtAndPayables.dana_luar_aktif, injeksi_aktif: debtAndPayables.injeksi_aktif },
    };
  }

  async getDebtAndPayables(ctx: AuthContext, input: unknown = {}) {
    this.requireReport(ctx);
    reportFilterSchema.parse(input);
    const [supplierDebts, danaLuar, injections] = await Promise.all([
      prisma.warungSupplierDebt.findMany({ where: { status: { in: ["OPEN", "PARTIAL"] } }, select: { remainingAmount: true } }),
      prisma.brilinkDanaLuar.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, select: { remainingAmount: true } }),
      prisma.brilinkInjection.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, select: { remainingAmount: true } }),
    ]);
    const hutangSupplier = this.sum(supplierDebts.map((debt) => debt.remainingAmount));
    const danaLuarAktif = this.sum(danaLuar.map((fund) => fund.remainingAmount));
    const injeksiAktif = this.sum(injections.map((fund) => fund.remainingAmount));
    return {
      hutang_supplier: money(hutangSupplier),
      kewajiban_konsinyasi_warung: "0",
      kewajiban_konsinyasi_brilink: "0",
      dana_luar_aktif: money(danaLuarAktif),
      injeksi_aktif: money(injeksiAktif),
      total_kewajiban: money(hutangSupplier + injeksiAktif),
    };
  }

  async getTemporaryFunds(ctx: AuthContext, input: unknown = {}) {
    this.requireReport(ctx);
    reportFilterSchema.parse(input);
    const [danaLuar, injections] = await Promise.all([
      prisma.brilinkDanaLuar.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, orderBy: { createdAt: "desc" } }),
      prisma.brilinkInjection.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, orderBy: { createdAt: "desc" } }),
    ]);
    return { dana_luar: danaLuar, injections };
  }

  async getConsignmentCombined(ctx: AuthContext) {
    this.requireReport(ctx);
    return { warung: { payable: "0" }, brilink: { payable: "0" } };
  }

  async getClosingDifferences(ctx: AuthContext) {
    this.requireReport(ctx);
    const [warung, brilink] = await Promise.all([
      prisma.warungClosing.findMany({ where: { status: "POSTED" }, orderBy: { operationalDate: "desc" } }),
      prisma.brilinkClosing.findMany({ where: { status: "POSTED" }, orderBy: { operationalDate: "desc" } }),
    ]);
    return { warung, brilink };
  }

  private warungCashBalance(rows: WarungCashLedgerRow[], account: WarungCashAccount) {
    return ledgerSum(rows.filter((row) => row.account === account));
  }

  private async warungProfit(dateFilter?: DateFilter) {
    const [sales, saleItems] = await Promise.all([
      prisma.warungSale.findMany({ where: { status: "COMPLETED", ...(dateFilter ? { operationalDate: dateFilter } : {}) }, select: { totalAmount: true } }),
      prisma.warungSaleItem.findMany({ where: { sale: { status: "COMPLETED", ...(dateFilter ? { operationalDate: dateFilter } : {}) } }, select: { profitAmount: true } }),
    ]);
    return { omzet: this.sum(sales.map((sale) => sale.totalAmount)), profit: this.sum(saleItems.map((item) => item.profitAmount)) };
  }

  private async brilinkRevenue(dateFilter?: DateFilter) {
    const fees = await prisma.brilinkFeeLedger.findMany({ where: dateFilter ? { operationalDate: dateFilter } : {}, select: { direction: true, amount: true } });
    return { fee_net: ledgerSum(fees) };
  }

  private async warungStockValue() {
    const products = await prisma.warungStockProduct.findMany({ select: { currentStockQty: true, currentHppAmount: true } });
    return products.reduce((total, product) => total + BigInt(product.currentStockQty.floor().toFixed(0)) * product.currentHppAmount, BigInt(0));
  }

  private sum(values: bigint[]) {
    return values.reduce((total, value) => total + value, BigInt(0));
  }

  private requireReport(ctx: AuthContext) {
    permissionService.require(ctx, "laporan-keuangan.view");
    permissionService.requireDomain(ctx, "GLOBAL");
  }
}

export const financialReportService = new FinancialReportService();
