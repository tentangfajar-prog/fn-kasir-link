-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Domain" AS ENUM ('GLOBAL', 'WARUNG', 'BRILINK');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PermissionEffect" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('SUPPLIER', 'CONSIGNMENT', 'BOTH');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SettingScope" AS ENUM ('GLOBAL', 'WARUNG', 'BRILINK', 'ABSENSI', 'PRINT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SellableItemType" AS ENUM ('NORMAL', 'RECIPE', 'BUNDLE');

-- CreateEnum
CREATE TYPE "PriceMode" AS ENUM ('MANUAL', 'AUTO_HPP_PROFIT');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('PURCHASE', 'SALE', 'COMPOSITION_SALE', 'STOCK_OPNAME', 'EXPIRED_RETURN', 'REVERSAL', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "StockDirection" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "StockOpnameStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentCategory" AS ENUM ('CASH', 'NON_CASH');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WarungCashAccount" AS ENUM ('KAS_LACI', 'KAS_AMAN');

-- CreateEnum
CREATE TYPE "WarungFinanceStatus" AS ENUM ('POSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchasePaymentStatus" AS ENUM ('PAID_CASH', 'SUPPLIER_DEBT');

-- CreateEnum
CREATE TYPE "SupplierDebtStatus" AS ENUM ('OPEN', 'PARTIAL', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BrilinkAmountFormula" AS ENUM ('NONE', 'NOMINAL', 'FEE', 'NOMINAL_PLUS_FEE');

-- CreateEnum
CREATE TYPE "BrilinkTransactionStatus" AS ENUM ('COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BrilinkFundAccount" AS ENUM ('CASH', 'SALDO');

-- CreateEnum
CREATE TYPE "BrilinkTemporaryFundStatus" AS ENUM ('ACTIVE', 'PARTIAL', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceRecordStatus" AS ENUM ('CHECKED_IN', 'CHECKED_OUT', 'CORRECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ClosingStatus" AS ENUM ('POSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConsignmentStatus" AS ENUM ('ACTIVE', 'SETTLED', 'RETURNED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT,
    "sensitive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "effect" "PermissionEffect" NOT NULL DEFAULT 'ALLOW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermissionOverride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "effect" "PermissionEffect" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPermissionOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "username" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "partnerType" "PartnerType" NOT NULL,
    "status" "PartnerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "scope" "SettingScope" NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "sensitive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSequence" (
    "id" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "code" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "currentNo" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "module" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintLog" (
    "id" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "module" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityNo" TEXT,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrintLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isDecimalAllowed" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WarungUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WarungProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungStockProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUnitId" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "minStockQty" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "currentStockQty" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "currentHppAmount" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WarungStockProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungProductUnitConversion" (
    "id" TEXT NOT NULL,
    "stockProductId" TEXT NOT NULL,
    "fromUnitId" TEXT NOT NULL,
    "toUnitId" TEXT NOT NULL,
    "conversionQty" DECIMAL(18,6) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungProductUnitConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungSellableItem" (
    "id" TEXT NOT NULL,
    "itemType" "SellableItemType" NOT NULL DEFAULT 'NORMAL',
    "stockProductId" TEXT,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "sellingPriceAmount" BIGINT NOT NULL,
    "priceMode" "PriceMode" NOT NULL DEFAULT 'MANUAL',
    "targetProfitAmount" BIGINT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WarungSellableItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungItemComposition" (
    "id" TEXT NOT NULL,
    "sellableItemId" TEXT NOT NULL,
    "componentProductId" TEXT NOT NULL,
    "qtyBase" DECIMAL(18,3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungItemComposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungStockMovement" (
    "id" TEXT NOT NULL,
    "stockProductId" TEXT NOT NULL,
    "movementType" "StockMovementType" NOT NULL,
    "direction" "StockDirection" NOT NULL,
    "qtyBase" DECIMAL(18,3) NOT NULL,
    "hppAmountSnapshot" BIGINT,
    "valueAmount" BIGINT,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarungStockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungStockOpname" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "status" "StockOpnameStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungStockOpname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungStockOpnameItem" (
    "id" TEXT NOT NULL,
    "opnameId" TEXT NOT NULL,
    "stockProductId" TEXT NOT NULL,
    "systemQtyBase" DECIMAL(18,3) NOT NULL,
    "physicalQtyBase" DECIMAL(18,3) NOT NULL,
    "differenceQtyBase" DECIMAL(18,3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarungStockOpnameItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungPaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "PaymentCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WarungPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungSale" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "cashierUserId" TEXT NOT NULL,
    "cashierNameSnapshot" TEXT NOT NULL,
    "cashierRoleSnapshot" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "paymentMethodNameSnapshot" TEXT NOT NULL,
    "paymentCategorySnapshot" "PaymentCategory" NOT NULL,
    "subtotalAmount" BIGINT NOT NULL,
    "totalDiscountAmount" BIGINT NOT NULL DEFAULT 0,
    "totalAmount" BIGINT NOT NULL,
    "cashReceivedAmount" BIGINT,
    "changeAmount" BIGINT,
    "status" "SaleStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungSaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "sellableItemId" TEXT NOT NULL,
    "stockProductId" TEXT,
    "sellableItemNameSnapshot" TEXT NOT NULL,
    "itemTypeSnapshot" "SellableItemType" NOT NULL,
    "categoryNameSnapshot" TEXT NOT NULL,
    "qty" DECIMAL(18,3) NOT NULL,
    "qtyBase" DECIMAL(18,3),
    "sellingPriceSnapshot" BIGINT NOT NULL,
    "hppSnapshotAmount" BIGINT,
    "grossAmount" BIGINT NOT NULL,
    "discountAmount" BIGINT NOT NULL DEFAULT 0,
    "netAmount" BIGINT NOT NULL,
    "profitAmount" BIGINT NOT NULL,
    "compositionSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarungSaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungPurchase" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "partnerId" TEXT NOT NULL,
    "partnerNameSnapshot" TEXT NOT NULL,
    "paymentStatus" "PurchasePaymentStatus" NOT NULL,
    "cashSource" "WarungCashAccount",
    "subtotalAmount" BIGINT NOT NULL,
    "invoiceDiscountAmount" BIGINT NOT NULL DEFAULT 0,
    "totalAmount" BIGINT NOT NULL,
    "status" "WarungFinanceStatus" NOT NULL DEFAULT 'POSTED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungPurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "stockProductId" TEXT NOT NULL,
    "stockProductNameSnapshot" TEXT NOT NULL,
    "qtyBase" DECIMAL(18,3) NOT NULL,
    "unitPriceAmount" BIGINT NOT NULL,
    "discountAmount" BIGINT NOT NULL DEFAULT 0,
    "invoiceDiscountShare" BIGINT NOT NULL DEFAULT 0,
    "netAmount" BIGINT NOT NULL,
    "hppAmount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarungPurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungSupplierDebt" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "partnerNameSnapshot" TEXT NOT NULL,
    "principalAmount" BIGINT NOT NULL,
    "paidAmount" BIGINT NOT NULL DEFAULT 0,
    "remainingAmount" BIGINT NOT NULL,
    "status" "SupplierDebtStatus" NOT NULL DEFAULT 'OPEN',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungSupplierDebt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungSupplierDebtPayment" (
    "id" TEXT NOT NULL,
    "debtId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "cashSource" "WarungCashAccount" NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" "WarungFinanceStatus" NOT NULL DEFAULT 'POSTED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungSupplierDebtPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungExpenseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WarungExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungExpense" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "account" "WarungCashAccount" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "categoryNameSnapshot" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" "WarungFinanceStatus" NOT NULL DEFAULT 'POSTED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungCashTransfer" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "fromAccount" "WarungCashAccount" NOT NULL,
    "toAccount" "WarungCashAccount" NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" "WarungFinanceStatus" NOT NULL DEFAULT 'POSTED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungCashTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungCashLedger" (
    "id" TEXT NOT NULL,
    "account" "WarungCashAccount" NOT NULL,
    "direction" "StockDirection" NOT NULL,
    "amount" BIGINT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarungCashLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungNonCashLedger" (
    "id" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "direction" "StockDirection" NOT NULL,
    "amount" BIGINT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarungNonCashLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkCashSaldoTemplate" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cashDirection" "StockDirection",
    "cashAmountFormula" "BrilinkAmountFormula" NOT NULL DEFAULT 'NONE',
    "saldoDirection" "StockDirection",
    "saldoAmountFormula" "BrilinkAmountFormula" NOT NULL DEFAULT 'NONE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkCashSaldoTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkTransactionType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BrilinkTransactionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkTariffGroup" (
    "id" TEXT NOT NULL,
    "transactionTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankCategory" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkTariffGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkTariffRange" (
    "id" TEXT NOT NULL,
    "tariffGroupId" TEXT NOT NULL,
    "minAmount" BIGINT NOT NULL,
    "maxAmount" BIGINT,
    "feeAmount" BIGINT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkTariffRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkTransaction" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "transactionTypeId" TEXT NOT NULL,
    "transactionTypeNameSnapshot" TEXT NOT NULL,
    "templateCodeSnapshot" TEXT NOT NULL,
    "bankCategory" TEXT,
    "nominalAmount" BIGINT NOT NULL,
    "feeAmount" BIGINT NOT NULL,
    "cashInAmount" BIGINT NOT NULL DEFAULT 0,
    "cashOutAmount" BIGINT NOT NULL DEFAULT 0,
    "saldoInAmount" BIGINT NOT NULL DEFAULT 0,
    "saldoOutAmount" BIGINT NOT NULL DEFAULT 0,
    "referenceNo" TEXT,
    "targetAccountNo" TEXT,
    "targetPhoneNo" TEXT,
    "targetName" TEXT,
    "providerName" TEXT,
    "customerName" TEXT,
    "status" "BrilinkTransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkCashLedger" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "direction" "StockDirection" NOT NULL,
    "amount" BIGINT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrilinkCashLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkSaldoLedger" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "direction" "StockDirection" NOT NULL,
    "amount" BIGINT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrilinkSaldoLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkFeeLedger" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "direction" "StockDirection" NOT NULL,
    "amount" BIGINT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrilinkFeeLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkDanaLuar" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "borrowerName" TEXT NOT NULL,
    "sourceAccount" "BrilinkFundAccount" NOT NULL,
    "principalAmount" BIGINT NOT NULL,
    "returnedAmount" BIGINT NOT NULL DEFAULT 0,
    "remainingAmount" BIGINT NOT NULL,
    "status" "BrilinkTemporaryFundStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkDanaLuar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkDanaLuarReturn" (
    "id" TEXT NOT NULL,
    "danaLuarId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "returnToAccount" "BrilinkFundAccount" NOT NULL,
    "amount" BIGINT NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkDanaLuarReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkInjection" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "fundProviderName" TEXT NOT NULL,
    "targetAccount" "BrilinkFundAccount" NOT NULL,
    "principalAmount" BIGINT NOT NULL,
    "returnedAmount" BIGINT NOT NULL DEFAULT 0,
    "remainingAmount" BIGINT NOT NULL,
    "status" "BrilinkTemporaryFundStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkInjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkInjectionReturn" (
    "id" TEXT NOT NULL,
    "injectionId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "returnFromAccount" "BrilinkFundAccount" NOT NULL,
    "amount" BIGINT NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkInjectionReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarungClosing" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "systemCashLaciAmount" BIGINT NOT NULL,
    "actualCashLaciAmount" BIGINT NOT NULL,
    "differenceAmount" BIGINT NOT NULL,
    "setoranAmanAmount" BIGINT NOT NULL,
    "status" "ClosingStatus" NOT NULL DEFAULT 'POSTED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarungClosing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrilinkClosing" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "systemCashAmount" BIGINT NOT NULL,
    "actualCashAmount" BIGINT NOT NULL,
    "cashDifferenceAmount" BIGINT NOT NULL,
    "systemSaldoAmount" BIGINT NOT NULL,
    "actualSaldoAmount" BIGINT NOT NULL,
    "saldoDifferenceAmount" BIGINT NOT NULL,
    "feeAmount" BIGINT NOT NULL,
    "danaLuarAmount" BIGINT NOT NULL,
    "injectionAmount" BIGINT NOT NULL,
    "status" "ClosingStatus" NOT NULL DEFAULT 'POSTED',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrilinkClosing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsignmentEntry" (
    "id" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "partnerId" TEXT NOT NULL,
    "partnerNameSnapshot" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "qtyReceived" DECIMAL(18,3) NOT NULL,
    "qtySold" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "qtyReturned" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "qtyPaid" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "unitCostAmount" BIGINT NOT NULL,
    "status" "ConsignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsignmentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsignmentPayment" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "qtyPaid" DECIMAL(18,3) NOT NULL,
    "amount" BIGINT NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsignmentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsignmentReturn" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "operationalDate" DATE NOT NULL,
    "qtyReturned" DECIMAL(18,3) NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsignmentReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReversalRecord" (
    "id" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReversalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSetting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "radiusMeters" INTEGER NOT NULL DEFAULT 100,
    "qrTtlSeconds" INTEGER NOT NULL DEFAULT 60,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttendanceSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceQrToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceQrToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attendanceDate" DATE NOT NULL,
    "checkInAt" TIMESTAMP(3),
    "checkInLatitude" DECIMAL(10,7),
    "checkInLongitude" DECIMAL(10,7),
    "checkInDistanceM" INTEGER,
    "checkOutAt" TIMESTAMP(3),
    "checkOutLatitude" DECIMAL(10,7),
    "checkOutLongitude" DECIMAL(10,7),
    "checkOutDistanceM" INTEGER,
    "status" "AttendanceRecordStatus" NOT NULL DEFAULT 'CHECKED_IN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceCorrection" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "oldValue" JSONB NOT NULL,
    "newValue" JSONB NOT NULL,
    "correctedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "entityNo" TEXT,
    "actorId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "Permission_domain_module_idx" ON "Permission"("domain", "module");

-- CreateIndex
CREATE INDEX "Permission_sensitive_idx" ON "Permission"("sensitive");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserPermissionOverride_permissionId_idx" ON "UserPermissionOverride"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermissionOverride_userId_permissionId_key" ON "UserPermissionOverride"("userId", "permissionId");

-- CreateIndex
CREATE INDEX "LoginHistory_userId_idx" ON "LoginHistory"("userId");

-- CreateIndex
CREATE INDEX "LoginHistory_username_idx" ON "LoginHistory"("username");

-- CreateIndex
CREATE INDEX "LoginHistory_createdAt_idx" ON "LoginHistory"("createdAt");

-- CreateIndex
CREATE INDEX "DeviceHistory_lastSeenAt_idx" ON "DeviceHistory"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceHistory_userId_fingerprint_key" ON "DeviceHistory"("userId", "fingerprint");

-- CreateIndex
CREATE INDEX "Partner_partnerType_status_idx" ON "Partner"("partnerType", "status");

-- CreateIndex
CREATE INDEX "Partner_name_idx" ON "Partner"("name");

-- CreateIndex
CREATE INDEX "Setting_scope_idx" ON "Setting"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_scope_key_key" ON "Setting"("scope", "key");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSequence_domain_code_key" ON "DocumentSequence"("domain", "code");

-- CreateIndex
CREATE INDEX "Attachment_domain_module_idx" ON "Attachment"("domain", "module");

-- CreateIndex
CREATE INDEX "Attachment_entityType_entityId_idx" ON "Attachment"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "PrintLog_domain_module_idx" ON "PrintLog"("domain", "module");

-- CreateIndex
CREATE INDEX "PrintLog_entityType_entityId_idx" ON "PrintLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "PrintLog_actorId_idx" ON "PrintLog"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungUnit_code_key" ON "WarungUnit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WarungProductCategory_code_key" ON "WarungProductCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WarungStockProduct_sku_key" ON "WarungStockProduct"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "WarungStockProduct_barcode_key" ON "WarungStockProduct"("barcode");

-- CreateIndex
CREATE INDEX "WarungStockProduct_name_idx" ON "WarungStockProduct"("name");

-- CreateIndex
CREATE INDEX "WarungStockProduct_isActive_idx" ON "WarungStockProduct"("isActive");

-- CreateIndex
CREATE INDEX "WarungProductUnitConversion_stockProductId_idx" ON "WarungProductUnitConversion"("stockProductId");

-- CreateIndex
CREATE INDEX "WarungProductUnitConversion_fromUnitId_toUnitId_idx" ON "WarungProductUnitConversion"("fromUnitId", "toUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungSellableItem_sku_key" ON "WarungSellableItem"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "WarungSellableItem_barcode_key" ON "WarungSellableItem"("barcode");

-- CreateIndex
CREATE INDEX "WarungSellableItem_name_idx" ON "WarungSellableItem"("name");

-- CreateIndex
CREATE INDEX "WarungSellableItem_categoryId_idx" ON "WarungSellableItem"("categoryId");

-- CreateIndex
CREATE INDEX "WarungSellableItem_isActive_idx" ON "WarungSellableItem"("isActive");

-- CreateIndex
CREATE INDEX "WarungItemComposition_sellableItemId_idx" ON "WarungItemComposition"("sellableItemId");

-- CreateIndex
CREATE INDEX "WarungItemComposition_componentProductId_idx" ON "WarungItemComposition"("componentProductId");

-- CreateIndex
CREATE INDEX "WarungStockMovement_stockProductId_idx" ON "WarungStockMovement"("stockProductId");

-- CreateIndex
CREATE INDEX "WarungStockMovement_movementType_idx" ON "WarungStockMovement"("movementType");

-- CreateIndex
CREATE INDEX "WarungStockMovement_operationalDate_idx" ON "WarungStockMovement"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungStockMovement_sourceType_sourceId_idx" ON "WarungStockMovement"("sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungStockOpname_documentNo_key" ON "WarungStockOpname"("documentNo");

-- CreateIndex
CREATE INDEX "WarungStockOpname_operationalDate_idx" ON "WarungStockOpname"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungStockOpname_status_idx" ON "WarungStockOpname"("status");

-- CreateIndex
CREATE INDEX "WarungStockOpnameItem_stockProductId_idx" ON "WarungStockOpnameItem"("stockProductId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungStockOpnameItem_opnameId_stockProductId_key" ON "WarungStockOpnameItem"("opnameId", "stockProductId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungPaymentMethod_code_key" ON "WarungPaymentMethod"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WarungSale_documentNo_key" ON "WarungSale"("documentNo");

-- CreateIndex
CREATE INDEX "WarungSale_operationalDate_idx" ON "WarungSale"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungSale_cashierUserId_idx" ON "WarungSale"("cashierUserId");

-- CreateIndex
CREATE INDEX "WarungSale_status_idx" ON "WarungSale"("status");

-- CreateIndex
CREATE INDEX "WarungSaleItem_saleId_idx" ON "WarungSaleItem"("saleId");

-- CreateIndex
CREATE INDEX "WarungSaleItem_sellableItemId_idx" ON "WarungSaleItem"("sellableItemId");

-- CreateIndex
CREATE INDEX "WarungSaleItem_stockProductId_idx" ON "WarungSaleItem"("stockProductId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungPurchase_documentNo_key" ON "WarungPurchase"("documentNo");

-- CreateIndex
CREATE INDEX "WarungPurchase_operationalDate_idx" ON "WarungPurchase"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungPurchase_partnerId_idx" ON "WarungPurchase"("partnerId");

-- CreateIndex
CREATE INDEX "WarungPurchase_paymentStatus_idx" ON "WarungPurchase"("paymentStatus");

-- CreateIndex
CREATE INDEX "WarungPurchase_status_idx" ON "WarungPurchase"("status");

-- CreateIndex
CREATE INDEX "WarungPurchaseItem_purchaseId_idx" ON "WarungPurchaseItem"("purchaseId");

-- CreateIndex
CREATE INDEX "WarungPurchaseItem_stockProductId_idx" ON "WarungPurchaseItem"("stockProductId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungSupplierDebt_purchaseId_key" ON "WarungSupplierDebt"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "WarungSupplierDebt_documentNo_key" ON "WarungSupplierDebt"("documentNo");

-- CreateIndex
CREATE INDEX "WarungSupplierDebt_partnerId_idx" ON "WarungSupplierDebt"("partnerId");

-- CreateIndex
CREATE INDEX "WarungSupplierDebt_status_idx" ON "WarungSupplierDebt"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WarungSupplierDebtPayment_documentNo_key" ON "WarungSupplierDebtPayment"("documentNo");

-- CreateIndex
CREATE INDEX "WarungSupplierDebtPayment_debtId_idx" ON "WarungSupplierDebtPayment"("debtId");

-- CreateIndex
CREATE INDEX "WarungSupplierDebtPayment_operationalDate_idx" ON "WarungSupplierDebtPayment"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungSupplierDebtPayment_status_idx" ON "WarungSupplierDebtPayment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WarungExpenseCategory_code_key" ON "WarungExpenseCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WarungExpense_documentNo_key" ON "WarungExpense"("documentNo");

-- CreateIndex
CREATE INDEX "WarungExpense_operationalDate_idx" ON "WarungExpense"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungExpense_account_idx" ON "WarungExpense"("account");

-- CreateIndex
CREATE INDEX "WarungExpense_categoryId_idx" ON "WarungExpense"("categoryId");

-- CreateIndex
CREATE INDEX "WarungExpense_status_idx" ON "WarungExpense"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WarungCashTransfer_documentNo_key" ON "WarungCashTransfer"("documentNo");

-- CreateIndex
CREATE INDEX "WarungCashTransfer_operationalDate_idx" ON "WarungCashTransfer"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungCashTransfer_fromAccount_toAccount_idx" ON "WarungCashTransfer"("fromAccount", "toAccount");

-- CreateIndex
CREATE INDEX "WarungCashTransfer_status_idx" ON "WarungCashTransfer"("status");

-- CreateIndex
CREATE INDEX "WarungCashLedger_account_idx" ON "WarungCashLedger"("account");

-- CreateIndex
CREATE INDEX "WarungCashLedger_sourceType_sourceId_idx" ON "WarungCashLedger"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "WarungCashLedger_operationalDate_idx" ON "WarungCashLedger"("operationalDate");

-- CreateIndex
CREATE INDEX "WarungNonCashLedger_paymentMethodId_idx" ON "WarungNonCashLedger"("paymentMethodId");

-- CreateIndex
CREATE INDEX "WarungNonCashLedger_sourceType_sourceId_idx" ON "WarungNonCashLedger"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "WarungNonCashLedger_operationalDate_idx" ON "WarungNonCashLedger"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkCashSaldoTemplate_code_key" ON "BrilinkCashSaldoTemplate"("code");

-- CreateIndex
CREATE INDEX "BrilinkCashSaldoTemplate_isActive_idx" ON "BrilinkCashSaldoTemplate"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkTransactionType_code_key" ON "BrilinkTransactionType"("code");

-- CreateIndex
CREATE INDEX "BrilinkTransactionType_templateId_idx" ON "BrilinkTransactionType"("templateId");

-- CreateIndex
CREATE INDEX "BrilinkTransactionType_isActive_idx" ON "BrilinkTransactionType"("isActive");

-- CreateIndex
CREATE INDEX "BrilinkTariffGroup_isActive_idx" ON "BrilinkTariffGroup"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkTariffGroup_transactionTypeId_bankCategory_key" ON "BrilinkTariffGroup"("transactionTypeId", "bankCategory");

-- CreateIndex
CREATE INDEX "BrilinkTariffRange_tariffGroupId_idx" ON "BrilinkTariffRange"("tariffGroupId");

-- CreateIndex
CREATE INDEX "BrilinkTariffRange_minAmount_maxAmount_idx" ON "BrilinkTariffRange"("minAmount", "maxAmount");

-- CreateIndex
CREATE INDEX "BrilinkTariffRange_isActive_idx" ON "BrilinkTariffRange"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkTransaction_documentNo_key" ON "BrilinkTransaction"("documentNo");

-- CreateIndex
CREATE INDEX "BrilinkTransaction_operationalDate_idx" ON "BrilinkTransaction"("operationalDate");

-- CreateIndex
CREATE INDEX "BrilinkTransaction_transactionTypeId_idx" ON "BrilinkTransaction"("transactionTypeId");

-- CreateIndex
CREATE INDEX "BrilinkTransaction_status_idx" ON "BrilinkTransaction"("status");

-- CreateIndex
CREATE INDEX "BrilinkTransaction_createdBy_idx" ON "BrilinkTransaction"("createdBy");

-- CreateIndex
CREATE INDEX "BrilinkCashLedger_transactionId_idx" ON "BrilinkCashLedger"("transactionId");

-- CreateIndex
CREATE INDEX "BrilinkCashLedger_sourceType_sourceId_idx" ON "BrilinkCashLedger"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "BrilinkCashLedger_operationalDate_idx" ON "BrilinkCashLedger"("operationalDate");

-- CreateIndex
CREATE INDEX "BrilinkSaldoLedger_transactionId_idx" ON "BrilinkSaldoLedger"("transactionId");

-- CreateIndex
CREATE INDEX "BrilinkSaldoLedger_sourceType_sourceId_idx" ON "BrilinkSaldoLedger"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "BrilinkSaldoLedger_operationalDate_idx" ON "BrilinkSaldoLedger"("operationalDate");

-- CreateIndex
CREATE INDEX "BrilinkFeeLedger_transactionId_idx" ON "BrilinkFeeLedger"("transactionId");

-- CreateIndex
CREATE INDEX "BrilinkFeeLedger_sourceType_sourceId_idx" ON "BrilinkFeeLedger"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "BrilinkFeeLedger_operationalDate_idx" ON "BrilinkFeeLedger"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkDanaLuar_documentNo_key" ON "BrilinkDanaLuar"("documentNo");

-- CreateIndex
CREATE INDEX "BrilinkDanaLuar_operationalDate_idx" ON "BrilinkDanaLuar"("operationalDate");

-- CreateIndex
CREATE INDEX "BrilinkDanaLuar_sourceAccount_idx" ON "BrilinkDanaLuar"("sourceAccount");

-- CreateIndex
CREATE INDEX "BrilinkDanaLuar_status_idx" ON "BrilinkDanaLuar"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkDanaLuarReturn_documentNo_key" ON "BrilinkDanaLuarReturn"("documentNo");

-- CreateIndex
CREATE INDEX "BrilinkDanaLuarReturn_danaLuarId_idx" ON "BrilinkDanaLuarReturn"("danaLuarId");

-- CreateIndex
CREATE INDEX "BrilinkDanaLuarReturn_operationalDate_idx" ON "BrilinkDanaLuarReturn"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkInjection_documentNo_key" ON "BrilinkInjection"("documentNo");

-- CreateIndex
CREATE INDEX "BrilinkInjection_operationalDate_idx" ON "BrilinkInjection"("operationalDate");

-- CreateIndex
CREATE INDEX "BrilinkInjection_targetAccount_idx" ON "BrilinkInjection"("targetAccount");

-- CreateIndex
CREATE INDEX "BrilinkInjection_status_idx" ON "BrilinkInjection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkInjectionReturn_documentNo_key" ON "BrilinkInjectionReturn"("documentNo");

-- CreateIndex
CREATE INDEX "BrilinkInjectionReturn_injectionId_idx" ON "BrilinkInjectionReturn"("injectionId");

-- CreateIndex
CREATE INDEX "BrilinkInjectionReturn_operationalDate_idx" ON "BrilinkInjectionReturn"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "WarungClosing_documentNo_key" ON "WarungClosing"("documentNo");

-- CreateIndex
CREATE INDEX "WarungClosing_operationalDate_idx" ON "WarungClosing"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "WarungClosing_operationalDate_status_key" ON "WarungClosing"("operationalDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkClosing_documentNo_key" ON "BrilinkClosing"("documentNo");

-- CreateIndex
CREATE INDEX "BrilinkClosing_operationalDate_idx" ON "BrilinkClosing"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "BrilinkClosing_operationalDate_status_key" ON "BrilinkClosing"("operationalDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ConsignmentEntry_documentNo_key" ON "ConsignmentEntry"("documentNo");

-- CreateIndex
CREATE INDEX "ConsignmentEntry_domain_idx" ON "ConsignmentEntry"("domain");

-- CreateIndex
CREATE INDEX "ConsignmentEntry_partnerId_idx" ON "ConsignmentEntry"("partnerId");

-- CreateIndex
CREATE INDEX "ConsignmentEntry_status_idx" ON "ConsignmentEntry"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ConsignmentPayment_documentNo_key" ON "ConsignmentPayment"("documentNo");

-- CreateIndex
CREATE INDEX "ConsignmentPayment_entryId_idx" ON "ConsignmentPayment"("entryId");

-- CreateIndex
CREATE INDEX "ConsignmentPayment_operationalDate_idx" ON "ConsignmentPayment"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "ConsignmentReturn_documentNo_key" ON "ConsignmentReturn"("documentNo");

-- CreateIndex
CREATE INDEX "ConsignmentReturn_entryId_idx" ON "ConsignmentReturn"("entryId");

-- CreateIndex
CREATE INDEX "ConsignmentReturn_operationalDate_idx" ON "ConsignmentReturn"("operationalDate");

-- CreateIndex
CREATE UNIQUE INDEX "ReversalRecord_documentNo_key" ON "ReversalRecord"("documentNo");

-- CreateIndex
CREATE INDEX "ReversalRecord_domain_idx" ON "ReversalRecord"("domain");

-- CreateIndex
CREATE INDEX "ReversalRecord_sourceType_sourceId_idx" ON "ReversalRecord"("sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ReversalRecord_domain_sourceType_sourceId_key" ON "ReversalRecord"("domain", "sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiSession_tokenHash_key" ON "ApiSession"("tokenHash");

-- CreateIndex
CREATE INDEX "ApiSession_userId_idx" ON "ApiSession"("userId");

-- CreateIndex
CREATE INDEX "ApiSession_expiresAt_idx" ON "ApiSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AttendanceSetting_isActive_idx" ON "AttendanceSetting"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceQrToken_tokenHash_key" ON "AttendanceQrToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AttendanceQrToken_expiresAt_idx" ON "AttendanceQrToken"("expiresAt");

-- CreateIndex
CREATE INDEX "AttendanceRecord_attendanceDate_idx" ON "AttendanceRecord"("attendanceDate");

-- CreateIndex
CREATE INDEX "AttendanceRecord_status_idx" ON "AttendanceRecord"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_userId_attendanceDate_key" ON "AttendanceRecord"("userId", "attendanceDate");

-- CreateIndex
CREATE INDEX "AttendanceCorrection_recordId_idx" ON "AttendanceCorrection"("recordId");

-- CreateIndex
CREATE INDEX "AttendanceCorrection_correctedBy_idx" ON "AttendanceCorrection"("correctedBy");

-- CreateIndex
CREATE INDEX "AuditLog_domain_module_idx" ON "AuditLog"("domain", "module");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissionOverride" ADD CONSTRAINT "UserPermissionOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissionOverride" ADD CONSTRAINT "UserPermissionOverride_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceHistory" ADD CONSTRAINT "DeviceHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungStockProduct" ADD CONSTRAINT "WarungStockProduct_baseUnitId_fkey" FOREIGN KEY ("baseUnitId") REFERENCES "WarungUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungProductUnitConversion" ADD CONSTRAINT "WarungProductUnitConversion_stockProductId_fkey" FOREIGN KEY ("stockProductId") REFERENCES "WarungStockProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungProductUnitConversion" ADD CONSTRAINT "WarungProductUnitConversion_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES "WarungUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungProductUnitConversion" ADD CONSTRAINT "WarungProductUnitConversion_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "WarungUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSellableItem" ADD CONSTRAINT "WarungSellableItem_stockProductId_fkey" FOREIGN KEY ("stockProductId") REFERENCES "WarungStockProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSellableItem" ADD CONSTRAINT "WarungSellableItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WarungProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungItemComposition" ADD CONSTRAINT "WarungItemComposition_sellableItemId_fkey" FOREIGN KEY ("sellableItemId") REFERENCES "WarungSellableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungItemComposition" ADD CONSTRAINT "WarungItemComposition_componentProductId_fkey" FOREIGN KEY ("componentProductId") REFERENCES "WarungStockProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungStockMovement" ADD CONSTRAINT "WarungStockMovement_stockProductId_fkey" FOREIGN KEY ("stockProductId") REFERENCES "WarungStockProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungStockOpnameItem" ADD CONSTRAINT "WarungStockOpnameItem_opnameId_fkey" FOREIGN KEY ("opnameId") REFERENCES "WarungStockOpname"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungStockOpnameItem" ADD CONSTRAINT "WarungStockOpnameItem_stockProductId_fkey" FOREIGN KEY ("stockProductId") REFERENCES "WarungStockProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSale" ADD CONSTRAINT "WarungSale_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "WarungPaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSaleItem" ADD CONSTRAINT "WarungSaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "WarungSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSaleItem" ADD CONSTRAINT "WarungSaleItem_sellableItemId_fkey" FOREIGN KEY ("sellableItemId") REFERENCES "WarungSellableItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSaleItem" ADD CONSTRAINT "WarungSaleItem_stockProductId_fkey" FOREIGN KEY ("stockProductId") REFERENCES "WarungStockProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungPurchaseItem" ADD CONSTRAINT "WarungPurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "WarungPurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungPurchaseItem" ADD CONSTRAINT "WarungPurchaseItem_stockProductId_fkey" FOREIGN KEY ("stockProductId") REFERENCES "WarungStockProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSupplierDebt" ADD CONSTRAINT "WarungSupplierDebt_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "WarungPurchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungSupplierDebtPayment" ADD CONSTRAINT "WarungSupplierDebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "WarungSupplierDebt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungExpense" ADD CONSTRAINT "WarungExpense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WarungExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarungNonCashLedger" ADD CONSTRAINT "WarungNonCashLedger_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "WarungPaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkTransactionType" ADD CONSTRAINT "BrilinkTransactionType_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "BrilinkCashSaldoTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkTariffGroup" ADD CONSTRAINT "BrilinkTariffGroup_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "BrilinkTransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkTariffRange" ADD CONSTRAINT "BrilinkTariffRange_tariffGroupId_fkey" FOREIGN KEY ("tariffGroupId") REFERENCES "BrilinkTariffGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkTransaction" ADD CONSTRAINT "BrilinkTransaction_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "BrilinkTransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkCashLedger" ADD CONSTRAINT "BrilinkCashLedger_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BrilinkTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkSaldoLedger" ADD CONSTRAINT "BrilinkSaldoLedger_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BrilinkTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkFeeLedger" ADD CONSTRAINT "BrilinkFeeLedger_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BrilinkTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkDanaLuarReturn" ADD CONSTRAINT "BrilinkDanaLuarReturn_danaLuarId_fkey" FOREIGN KEY ("danaLuarId") REFERENCES "BrilinkDanaLuar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrilinkInjectionReturn" ADD CONSTRAINT "BrilinkInjectionReturn_injectionId_fkey" FOREIGN KEY ("injectionId") REFERENCES "BrilinkInjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsignmentPayment" ADD CONSTRAINT "ConsignmentPayment_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ConsignmentEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsignmentReturn" ADD CONSTRAINT "ConsignmentReturn_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ConsignmentEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSession" ADD CONSTRAINT "ApiSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceCorrection" ADD CONSTRAINT "AttendanceCorrection_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "AttendanceRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

