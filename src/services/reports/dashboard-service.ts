import { prisma } from "@/lib/prisma";
import { dailyChartFilterSchema, monthlyChartFilterSchema, reportFilterSchema } from "@/lib/validations/reports";
import { financialReportService } from "@/services/reports/financial-report-service";
import { permissionService } from "@/services/permissions/permission-service";
import type { AuthContext } from "@/types/auth";

type Metric = "pendapatan" | "profit" | "fee" | "transaction_count";
type Mode = "combined" | "split_domain";
type DateFilter = { gte?: Date; lte?: Date };
type MoneyPoint = { date: string; warung: bigint; brilink: bigint };

function dateFilter(from?: string, to?: string): DateFilter | undefined {
  if (!from && !to) return undefined;
  return { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };
}

function monthRange(month: string) {
  const [year, zeroBasedMonth] = month.split("-").map(Number);
  const from = new Date(year, zeroBasedMonth - 1, 1);
  const to = new Date(year, zeroBasedMonth, 0);
  return { from, to };
}

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthKey(date: Date) {
  return date.toISOString().slice(0, 7);
}

function money(value: bigint) {
  return value.toString();
}

export class DashboardService {
  async getOwnerSummary(ctx: AuthContext, input: unknown = {}) {
    this.requireDashboard(ctx);
    const summary = await financialReportService.getSummary(ctx, input);
    return {
      ringkasan_utama: summary,
      warung: await this.getWarungDashboard(ctx, input),
      brilink: await this.getBrilinkDashboard(ctx, input),
    };
  }

  async getWarungDashboard(ctx: AuthContext, input: unknown = {}) {
    this.requireDomainDashboard(ctx, "WARUNG");
    const filter = reportFilterSchema.parse(input);
    const operationalDate = dateFilter(filter.date_from, filter.date_to);
    const [sales, saleItems, expenses, purchases, stockProducts, debts] = await Promise.all([
      prisma.warungSale.findMany({ where: { status: "COMPLETED", ...(operationalDate ? { operationalDate } : {}) }, select: { totalAmount: true } }),
      prisma.warungSaleItem.findMany({ where: { sale: { status: "COMPLETED", ...(operationalDate ? { operationalDate } : {}) } }, select: { profitAmount: true } }),
      prisma.warungExpense.findMany({ where: { status: "POSTED", ...(operationalDate ? { operationalDate } : {}) }, select: { amount: true } }),
      prisma.warungPurchase.findMany({ where: { status: "POSTED", ...(operationalDate ? { operationalDate } : {}) }, select: { totalAmount: true } }),
      prisma.warungStockProduct.findMany({ select: { currentStockQty: true, currentHppAmount: true } }),
      prisma.warungSupplierDebt.findMany({ where: { status: { in: ["OPEN", "PARTIAL"] } }, select: { remainingAmount: true } }),
    ]);
    return {
      omzet: money(this.sum(sales.map((sale) => sale.totalAmount))),
      profit: money(this.sum(saleItems.map((item) => item.profitAmount))),
      pengeluaran: money(this.sum(expenses.map((expense) => expense.amount))),
      pembelian: money(this.sum(purchases.map((purchase) => purchase.totalAmount))),
      nilai_stok: money(stockProducts.reduce((total, product) => total + BigInt(product.currentStockQty.floor().toFixed(0)) * product.currentHppAmount, BigInt(0))),
      hutang_supplier: money(this.sum(debts.map((debt) => debt.remainingAmount))),
    };
  }

  async getBrilinkDashboard(ctx: AuthContext, input: unknown = {}) {
    this.requireDomainDashboard(ctx, "BRILINK");
    const filter = reportFilterSchema.parse(input);
    const operationalDate = dateFilter(filter.date_from, filter.date_to);
    const [transactions, feeLedgers, cashLedgers, saldoLedgers, danaLuar, injections] = await Promise.all([
      prisma.brilinkTransaction.findMany({ where: { status: "COMPLETED", ...(operationalDate ? { operationalDate } : {}) }, select: { nominalAmount: true } }),
      prisma.brilinkFeeLedger.findMany({ where: operationalDate ? { operationalDate } : {}, select: { direction: true, amount: true } }),
      prisma.brilinkCashLedger.findMany({ select: { direction: true, amount: true } }),
      prisma.brilinkSaldoLedger.findMany({ select: { direction: true, amount: true } }),
      prisma.brilinkDanaLuar.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, select: { remainingAmount: true } }),
      prisma.brilinkInjection.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, select: { remainingAmount: true } }),
    ]);
    return {
      transaksi_count: transactions.length,
      nominal_transaksi: money(this.sum(transactions.map((trx) => trx.nominalAmount))),
      fee_net: money(this.ledgerSum(feeLedgers)),
      cash: money(this.ledgerSum(cashLedgers)),
      saldo: money(this.ledgerSum(saldoLedgers)),
      dana_luar_aktif: money(this.sum(danaLuar.map((item) => item.remainingAmount))),
      injeksi_aktif: money(this.sum(injections.map((item) => item.remainingAmount))),
    };
  }

  async getDailyChart(ctx: AuthContext, input: unknown) {
    this.requireDashboard(ctx);
    const filter = dailyChartFilterSchema.parse(input);
    const current = await this.dailyPoints(filter.metric, filter.month);
    const previous = filter.compare_with_previous ? await this.dailyPoints(filter.metric, this.previousMonth(filter.month)) : [];
    return { metric: filter.metric, mode: filter.mode, current: this.formatPoints(current, filter.mode), previous: this.formatPoints(previous, filter.mode) };
  }

  async getMonthlyChart(ctx: AuthContext, input: unknown) {
    this.requireDashboard(ctx);
    const filter = monthlyChartFilterSchema.parse(input);
    const points = await this.monthlyPoints(filter.metric, filter.year);
    return { metric: filter.metric, mode: filter.mode, points: this.formatPoints(points, filter.mode) };
  }

  private async dailyPoints(metric: Metric, month: string) {
    const { from, to } = monthRange(month);
    return this.points(metric, { gte: from, lte: to }, isoDay);
  }

  private async monthlyPoints(metric: "pendapatan" | "profit", year: number) {
    return this.points(metric, { gte: new Date(year, 0, 1), lte: new Date(year, 11, 31) }, monthKey);
  }

  private async points(metric: Metric, operationalDate: DateFilter, key: (date: Date) => string): Promise<MoneyPoint[]> {
    const buckets = new Map<string, { warung: bigint; brilink: bigint }>();
    const add = (date: Date, domain: "warung" | "brilink", value: bigint) => {
      const bucketKey = key(date);
      const current = buckets.get(bucketKey) ?? { warung: BigInt(0), brilink: BigInt(0) };
      current[domain] += value;
      buckets.set(bucketKey, current);
    };

    if (metric === "pendapatan") {
      const [sales, fees] = await Promise.all([
        prisma.warungSale.findMany({ where: { status: "COMPLETED", operationalDate }, select: { operationalDate: true, totalAmount: true } }),
        prisma.brilinkFeeLedger.findMany({ where: { operationalDate }, select: { operationalDate: true, direction: true, amount: true } }),
      ]);
      sales.forEach((sale) => add(sale.operationalDate, "warung", sale.totalAmount));
      fees.forEach((fee) => add(fee.operationalDate, "brilink", fee.direction === "IN" ? fee.amount : -fee.amount));
    }

    if (metric === "profit") {
      const [items, fees] = await Promise.all([
        prisma.warungSaleItem.findMany({ where: { sale: { status: "COMPLETED", operationalDate } }, select: { profitAmount: true, sale: { select: { operationalDate: true } } } }),
        prisma.brilinkFeeLedger.findMany({ where: { operationalDate }, select: { operationalDate: true, direction: true, amount: true } }),
      ]);
      items.forEach((item) => add(item.sale.operationalDate, "warung", item.profitAmount));
      fees.forEach((fee) => add(fee.operationalDate, "brilink", fee.direction === "IN" ? fee.amount : -fee.amount));
    }

    if (metric === "fee") {
      const fees = await prisma.brilinkFeeLedger.findMany({ where: { operationalDate }, select: { operationalDate: true, direction: true, amount: true } });
      fees.forEach((fee) => add(fee.operationalDate, "brilink", fee.direction === "IN" ? fee.amount : -fee.amount));
    }

    if (metric === "transaction_count") {
      const [sales, transactions] = await Promise.all([
        prisma.warungSale.findMany({ where: { status: "COMPLETED", operationalDate }, select: { operationalDate: true } }),
        prisma.brilinkTransaction.findMany({ where: { status: "COMPLETED", operationalDate }, select: { operationalDate: true } }),
      ]);
      sales.forEach((sale) => add(sale.operationalDate, "warung", BigInt(1)));
      transactions.forEach((trx) => add(trx.operationalDate, "brilink", BigInt(1)));
    }

    return [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({ date, ...value }));
  }

  private formatPoints(points: MoneyPoint[], mode: Mode) {
    return points.map((point) => ({
      date: point.date,
      ...(mode === "split_domain" ? { warung: money(point.warung), brilink: money(point.brilink) } : { value: money(point.warung + point.brilink) }),
      drilldown: { target: "/laporan-keuangan", filters: { date: point.date } },
    }));
  }

  private previousMonth(month: string) {
    const { from } = monthRange(month);
    from.setMonth(from.getMonth() - 1);
    return from.toISOString().slice(0, 7);
  }

  private ledgerSum(rows: { direction: "IN" | "OUT"; amount: bigint }[]) {
    return rows.reduce((total, row) => total + (row.direction === "IN" ? row.amount : -row.amount), BigInt(0));
  }

  private sum(values: bigint[]) {
    return values.reduce((total, value) => total + value, BigInt(0));
  }

  private requireDashboard(ctx: AuthContext) {
    permissionService.require(ctx, "dashboard.view");
    permissionService.requireDomain(ctx, "GLOBAL");
  }

  private requireDomainDashboard(ctx: AuthContext, domain: "WARUNG" | "BRILINK") {
    permissionService.require(ctx, "dashboard.view");
    permissionService.requireDomain(ctx, domain);
  }
}

export const dashboardService = new DashboardService();
