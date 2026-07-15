-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT false,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_roleId_idx`(`roleId`),
    INDEX `User_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isSystem` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `sensitive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Permission_code_key`(`code`),
    INDEX `Permission_domain_module_idx`(`domain`, `module`),
    INDEX `Permission_sensitive_idx`(`sensitive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `effect` ENUM('ALLOW', 'DENY') NOT NULL DEFAULT 'ALLOW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RolePermission_permissionId_idx`(`permissionId`),
    UNIQUE INDEX `RolePermission_roleId_permissionId_key`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermissionOverride` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `effect` ENUM('ALLOW', 'DENY') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserPermissionOverride_permissionId_idx`(`permissionId`),
    UNIQUE INDEX `UserPermissionOverride_userId_permissionId_key`(`userId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginHistory` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `success` BOOLEAN NOT NULL,
    `reason` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginHistory_userId_idx`(`userId`),
    INDEX `LoginHistory_username_idx`(`username`),
    INDEX `LoginHistory_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceHistory` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fingerprint` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DeviceHistory_lastSeenAt_idx`(`lastSeenAt`),
    UNIQUE INDEX `DeviceHistory_userId_fingerprint_key`(`userId`, `fingerprint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `partnerType` ENUM('SUPPLIER', 'CONSIGNMENT', 'BOTH') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Partner_partnerType_status_idx`(`partnerType`, `status`),
    INDEX `Partner_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL,
    `scope` ENUM('GLOBAL', 'WARUNG', 'BRILINK', 'ABSENSI', 'PRINT', 'SYSTEM') NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `sensitive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Setting_scope_idx`(`scope`),
    UNIQUE INDEX `Setting_scope_key_key`(`scope`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentSequence` (
    `id` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(191) NOT NULL,
    `currentNo` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DocumentSequence_domain_code_key`(`domain`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `storageKey` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Attachment_domain_module_idx`(`domain`, `module`),
    INDEX `Attachment_entityType_entityId_idx`(`entityType`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrintLog` (
    `id` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `entityNo` VARCHAR(191) NULL,
    `actorId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PrintLog_domain_module_idx`(`domain`, `module`),
    INDEX `PrintLog_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `PrintLog_actorId_idx`(`actorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungUnit` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `isDecimalAllowed` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `WarungUnit_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungProductCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `WarungProductCategory_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungStockProduct` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `baseUnitId` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,
    `minStockQty` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `currentStockQty` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `currentHppAmount` BIGINT NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `WarungStockProduct_sku_key`(`sku`),
    UNIQUE INDEX `WarungStockProduct_barcode_key`(`barcode`),
    INDEX `WarungStockProduct_name_idx`(`name`),
    INDEX `WarungStockProduct_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungProductUnitConversion` (
    `id` VARCHAR(191) NOT NULL,
    `stockProductId` VARCHAR(191) NOT NULL,
    `fromUnitId` VARCHAR(191) NOT NULL,
    `toUnitId` VARCHAR(191) NOT NULL,
    `conversionQty` DECIMAL(18, 6) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WarungProductUnitConversion_stockProductId_idx`(`stockProductId`),
    INDEX `WarungProductUnitConversion_fromUnitId_toUnitId_idx`(`fromUnitId`, `toUnitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungSellableItem` (
    `id` VARCHAR(191) NOT NULL,
    `itemType` ENUM('NORMAL', 'RECIPE', 'BUNDLE') NOT NULL DEFAULT 'NORMAL',
    `stockProductId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,
    `sellingPriceAmount` BIGINT NOT NULL,
    `priceMode` ENUM('MANUAL', 'AUTO_HPP_PROFIT') NOT NULL DEFAULT 'MANUAL',
    `targetProfitAmount` BIGINT NULL,
    `isFavorite` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `WarungSellableItem_sku_key`(`sku`),
    UNIQUE INDEX `WarungSellableItem_barcode_key`(`barcode`),
    INDEX `WarungSellableItem_name_idx`(`name`),
    INDEX `WarungSellableItem_categoryId_idx`(`categoryId`),
    INDEX `WarungSellableItem_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungItemComposition` (
    `id` VARCHAR(191) NOT NULL,
    `sellableItemId` VARCHAR(191) NOT NULL,
    `componentProductId` VARCHAR(191) NOT NULL,
    `qtyBase` DECIMAL(18, 3) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WarungItemComposition_sellableItemId_idx`(`sellableItemId`),
    INDEX `WarungItemComposition_componentProductId_idx`(`componentProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungStockMovement` (
    `id` VARCHAR(191) NOT NULL,
    `stockProductId` VARCHAR(191) NOT NULL,
    `movementType` ENUM('PURCHASE', 'SALE', 'COMPOSITION_SALE', 'STOCK_OPNAME', 'EXPIRED_RETURN', 'REVERSAL', 'ADJUSTMENT') NOT NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `qtyBase` DECIMAL(18, 3) NOT NULL,
    `hppAmountSnapshot` BIGINT NULL,
    `valueAmount` BIGINT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WarungStockMovement_stockProductId_idx`(`stockProductId`),
    INDEX `WarungStockMovement_movementType_idx`(`movementType`),
    INDEX `WarungStockMovement_operationalDate_idx`(`operationalDate`),
    INDEX `WarungStockMovement_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungStockOpname` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `status` ENUM('DRAFT', 'POSTED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `notes` VARCHAR(191) NULL,
    `postedAt` DATETIME(3) NULL,
    `postedBy` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungStockOpname_documentNo_key`(`documentNo`),
    INDEX `WarungStockOpname_operationalDate_idx`(`operationalDate`),
    INDEX `WarungStockOpname_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungStockOpnameItem` (
    `id` VARCHAR(191) NOT NULL,
    `opnameId` VARCHAR(191) NOT NULL,
    `stockProductId` VARCHAR(191) NOT NULL,
    `systemQtyBase` DECIMAL(18, 3) NOT NULL,
    `physicalQtyBase` DECIMAL(18, 3) NOT NULL,
    `differenceQtyBase` DECIMAL(18, 3) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WarungStockOpnameItem_stockProductId_idx`(`stockProductId`),
    UNIQUE INDEX `WarungStockOpnameItem_opnameId_stockProductId_key`(`opnameId`, `stockProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungPaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `category` ENUM('CASH', 'NON_CASH') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `WarungPaymentMethod_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungSale` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `cashierUserId` VARCHAR(191) NOT NULL,
    `cashierNameSnapshot` VARCHAR(191) NOT NULL,
    `cashierRoleSnapshot` VARCHAR(191) NOT NULL,
    `paymentMethodId` VARCHAR(191) NOT NULL,
    `paymentMethodNameSnapshot` VARCHAR(191) NOT NULL,
    `paymentCategorySnapshot` ENUM('CASH', 'NON_CASH') NOT NULL,
    `subtotalAmount` BIGINT NOT NULL,
    `totalDiscountAmount` BIGINT NOT NULL DEFAULT 0,
    `totalAmount` BIGINT NOT NULL,
    `cashReceivedAmount` BIGINT NULL,
    `changeAmount` BIGINT NULL,
    `status` ENUM('COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungSale_documentNo_key`(`documentNo`),
    INDEX `WarungSale_operationalDate_idx`(`operationalDate`),
    INDEX `WarungSale_cashierUserId_idx`(`cashierUserId`),
    INDEX `WarungSale_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungSaleItem` (
    `id` VARCHAR(191) NOT NULL,
    `saleId` VARCHAR(191) NOT NULL,
    `sellableItemId` VARCHAR(191) NOT NULL,
    `stockProductId` VARCHAR(191) NULL,
    `sellableItemNameSnapshot` VARCHAR(191) NOT NULL,
    `itemTypeSnapshot` ENUM('NORMAL', 'RECIPE', 'BUNDLE') NOT NULL,
    `categoryNameSnapshot` VARCHAR(191) NOT NULL,
    `qty` DECIMAL(18, 3) NOT NULL,
    `qtyBase` DECIMAL(18, 3) NULL,
    `sellingPriceSnapshot` BIGINT NOT NULL,
    `hppSnapshotAmount` BIGINT NULL,
    `grossAmount` BIGINT NOT NULL,
    `discountAmount` BIGINT NOT NULL DEFAULT 0,
    `netAmount` BIGINT NOT NULL,
    `profitAmount` BIGINT NOT NULL,
    `compositionSnapshot` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WarungSaleItem_saleId_idx`(`saleId`),
    INDEX `WarungSaleItem_sellableItemId_idx`(`sellableItemId`),
    INDEX `WarungSaleItem_stockProductId_idx`(`stockProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungPurchase` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `partnerNameSnapshot` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('PAID_CASH', 'SUPPLIER_DEBT') NOT NULL,
    `cashSource` ENUM('KAS_LACI', 'KAS_AMAN') NULL,
    `subtotalAmount` BIGINT NOT NULL,
    `invoiceDiscountAmount` BIGINT NOT NULL DEFAULT 0,
    `totalAmount` BIGINT NOT NULL,
    `status` ENUM('POSTED', 'CANCELLED') NOT NULL DEFAULT 'POSTED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungPurchase_documentNo_key`(`documentNo`),
    INDEX `WarungPurchase_operationalDate_idx`(`operationalDate`),
    INDEX `WarungPurchase_partnerId_idx`(`partnerId`),
    INDEX `WarungPurchase_paymentStatus_idx`(`paymentStatus`),
    INDEX `WarungPurchase_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungPurchaseItem` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `stockProductId` VARCHAR(191) NOT NULL,
    `stockProductNameSnapshot` VARCHAR(191) NOT NULL,
    `qtyBase` DECIMAL(18, 3) NOT NULL,
    `unitPriceAmount` BIGINT NOT NULL,
    `discountAmount` BIGINT NOT NULL DEFAULT 0,
    `invoiceDiscountShare` BIGINT NOT NULL DEFAULT 0,
    `netAmount` BIGINT NOT NULL,
    `hppAmount` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WarungPurchaseItem_purchaseId_idx`(`purchaseId`),
    INDEX `WarungPurchaseItem_stockProductId_idx`(`stockProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungSupplierDebt` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `partnerNameSnapshot` VARCHAR(191) NOT NULL,
    `principalAmount` BIGINT NOT NULL,
    `paidAmount` BIGINT NOT NULL DEFAULT 0,
    `remainingAmount` BIGINT NOT NULL,
    `status` ENUM('OPEN', 'PARTIAL', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungSupplierDebt_purchaseId_key`(`purchaseId`),
    UNIQUE INDEX `WarungSupplierDebt_documentNo_key`(`documentNo`),
    INDEX `WarungSupplierDebt_partnerId_idx`(`partnerId`),
    INDEX `WarungSupplierDebt_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungSupplierDebtPayment` (
    `id` VARCHAR(191) NOT NULL,
    `debtId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `cashSource` ENUM('KAS_LACI', 'KAS_AMAN') NOT NULL,
    `amount` BIGINT NOT NULL,
    `status` ENUM('POSTED', 'CANCELLED') NOT NULL DEFAULT 'POSTED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungSupplierDebtPayment_documentNo_key`(`documentNo`),
    INDEX `WarungSupplierDebtPayment_debtId_idx`(`debtId`),
    INDEX `WarungSupplierDebtPayment_operationalDate_idx`(`operationalDate`),
    INDEX `WarungSupplierDebtPayment_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungExpenseCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `WarungExpenseCategory_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungExpense` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `account` ENUM('KAS_LACI', 'KAS_AMAN') NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `categoryNameSnapshot` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` BIGINT NOT NULL,
    `status` ENUM('POSTED', 'CANCELLED') NOT NULL DEFAULT 'POSTED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungExpense_documentNo_key`(`documentNo`),
    INDEX `WarungExpense_operationalDate_idx`(`operationalDate`),
    INDEX `WarungExpense_account_idx`(`account`),
    INDEX `WarungExpense_categoryId_idx`(`categoryId`),
    INDEX `WarungExpense_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungCashTransfer` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `fromAccount` ENUM('KAS_LACI', 'KAS_AMAN') NOT NULL,
    `toAccount` ENUM('KAS_LACI', 'KAS_AMAN') NOT NULL,
    `amount` BIGINT NOT NULL,
    `status` ENUM('POSTED', 'CANCELLED') NOT NULL DEFAULT 'POSTED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungCashTransfer_documentNo_key`(`documentNo`),
    INDEX `WarungCashTransfer_operationalDate_idx`(`operationalDate`),
    INDEX `WarungCashTransfer_fromAccount_toAccount_idx`(`fromAccount`, `toAccount`),
    INDEX `WarungCashTransfer_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungCashLedger` (
    `id` VARCHAR(191) NOT NULL,
    `account` ENUM('KAS_LACI', 'KAS_AMAN') NOT NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `amount` BIGINT NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WarungCashLedger_account_idx`(`account`),
    INDEX `WarungCashLedger_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    INDEX `WarungCashLedger_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungNonCashLedger` (
    `id` VARCHAR(191) NOT NULL,
    `paymentMethodId` VARCHAR(191) NOT NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `amount` BIGINT NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WarungNonCashLedger_paymentMethodId_idx`(`paymentMethodId`),
    INDEX `WarungNonCashLedger_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    INDEX `WarungNonCashLedger_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkCashSaldoTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cashDirection` ENUM('IN', 'OUT') NULL,
    `cashAmountFormula` ENUM('NONE', 'NOMINAL', 'FEE', 'NOMINAL_PLUS_FEE') NOT NULL DEFAULT 'NONE',
    `saldoDirection` ENUM('IN', 'OUT') NULL,
    `saldoAmountFormula` ENUM('NONE', 'NOMINAL', 'FEE', 'NOMINAL_PLUS_FEE') NOT NULL DEFAULT 'NONE',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkCashSaldoTemplate_code_key`(`code`),
    INDEX `BrilinkCashSaldoTemplate_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkTransactionType` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `BrilinkTransactionType_code_key`(`code`),
    INDEX `BrilinkTransactionType_templateId_idx`(`templateId`),
    INDEX `BrilinkTransactionType_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkTariffGroup` (
    `id` VARCHAR(191) NOT NULL,
    `transactionTypeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bankCategory` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BrilinkTariffGroup_isActive_idx`(`isActive`),
    UNIQUE INDEX `BrilinkTariffGroup_transactionTypeId_bankCategory_key`(`transactionTypeId`, `bankCategory`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkTariffRange` (
    `id` VARCHAR(191) NOT NULL,
    `tariffGroupId` VARCHAR(191) NOT NULL,
    `minAmount` BIGINT NOT NULL,
    `maxAmount` BIGINT NULL,
    `feeAmount` BIGINT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BrilinkTariffRange_tariffGroupId_idx`(`tariffGroupId`),
    INDEX `BrilinkTariffRange_minAmount_maxAmount_idx`(`minAmount`, `maxAmount`),
    INDEX `BrilinkTariffRange_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `transactionTypeId` VARCHAR(191) NOT NULL,
    `transactionTypeNameSnapshot` VARCHAR(191) NOT NULL,
    `templateCodeSnapshot` VARCHAR(191) NOT NULL,
    `bankCategory` VARCHAR(191) NULL,
    `nominalAmount` BIGINT NOT NULL,
    `feeAmount` BIGINT NOT NULL,
    `cashInAmount` BIGINT NOT NULL DEFAULT 0,
    `cashOutAmount` BIGINT NOT NULL DEFAULT 0,
    `saldoInAmount` BIGINT NOT NULL DEFAULT 0,
    `saldoOutAmount` BIGINT NOT NULL DEFAULT 0,
    `referenceNo` VARCHAR(191) NULL,
    `targetAccountNo` VARCHAR(191) NULL,
    `targetPhoneNo` VARCHAR(191) NULL,
    `targetName` VARCHAR(191) NULL,
    `providerName` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `status` ENUM('COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkTransaction_documentNo_key`(`documentNo`),
    INDEX `BrilinkTransaction_operationalDate_idx`(`operationalDate`),
    INDEX `BrilinkTransaction_transactionTypeId_idx`(`transactionTypeId`),
    INDEX `BrilinkTransaction_status_idx`(`status`),
    INDEX `BrilinkTransaction_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkCashLedger` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `amount` BIGINT NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BrilinkCashLedger_transactionId_idx`(`transactionId`),
    INDEX `BrilinkCashLedger_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    INDEX `BrilinkCashLedger_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkSaldoLedger` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `amount` BIGINT NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BrilinkSaldoLedger_transactionId_idx`(`transactionId`),
    INDEX `BrilinkSaldoLedger_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    INDEX `BrilinkSaldoLedger_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkFeeLedger` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `direction` ENUM('IN', 'OUT') NOT NULL,
    `amount` BIGINT NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BrilinkFeeLedger_transactionId_idx`(`transactionId`),
    INDEX `BrilinkFeeLedger_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    INDEX `BrilinkFeeLedger_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkDanaLuar` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `borrowerName` VARCHAR(191) NOT NULL,
    `sourceAccount` ENUM('CASH', 'SALDO') NOT NULL,
    `principalAmount` BIGINT NOT NULL,
    `returnedAmount` BIGINT NOT NULL DEFAULT 0,
    `remainingAmount` BIGINT NOT NULL,
    `status` ENUM('ACTIVE', 'PARTIAL', 'RETURNED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkDanaLuar_documentNo_key`(`documentNo`),
    INDEX `BrilinkDanaLuar_operationalDate_idx`(`operationalDate`),
    INDEX `BrilinkDanaLuar_sourceAccount_idx`(`sourceAccount`),
    INDEX `BrilinkDanaLuar_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkDanaLuarReturn` (
    `id` VARCHAR(191) NOT NULL,
    `danaLuarId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `returnToAccount` ENUM('CASH', 'SALDO') NOT NULL,
    `amount` BIGINT NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkDanaLuarReturn_documentNo_key`(`documentNo`),
    INDEX `BrilinkDanaLuarReturn_danaLuarId_idx`(`danaLuarId`),
    INDEX `BrilinkDanaLuarReturn_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkInjection` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `fundProviderName` VARCHAR(191) NOT NULL,
    `targetAccount` ENUM('CASH', 'SALDO') NOT NULL,
    `principalAmount` BIGINT NOT NULL,
    `returnedAmount` BIGINT NOT NULL DEFAULT 0,
    `remainingAmount` BIGINT NOT NULL,
    `status` ENUM('ACTIVE', 'PARTIAL', 'RETURNED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkInjection_documentNo_key`(`documentNo`),
    INDEX `BrilinkInjection_operationalDate_idx`(`operationalDate`),
    INDEX `BrilinkInjection_targetAccount_idx`(`targetAccount`),
    INDEX `BrilinkInjection_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkInjectionReturn` (
    `id` VARCHAR(191) NOT NULL,
    `injectionId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `returnFromAccount` ENUM('CASH', 'SALDO') NOT NULL,
    `amount` BIGINT NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkInjectionReturn_documentNo_key`(`documentNo`),
    INDEX `BrilinkInjectionReturn_injectionId_idx`(`injectionId`),
    INDEX `BrilinkInjectionReturn_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarungClosing` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `systemCashLaciAmount` BIGINT NOT NULL,
    `actualCashLaciAmount` BIGINT NOT NULL,
    `differenceAmount` BIGINT NOT NULL,
    `setoranAmanAmount` BIGINT NOT NULL,
    `status` ENUM('POSTED', 'CANCELLED') NOT NULL DEFAULT 'POSTED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WarungClosing_documentNo_key`(`documentNo`),
    INDEX `WarungClosing_operationalDate_idx`(`operationalDate`),
    UNIQUE INDEX `WarungClosing_operationalDate_status_key`(`operationalDate`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BrilinkClosing` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `systemCashAmount` BIGINT NOT NULL,
    `actualCashAmount` BIGINT NOT NULL,
    `cashDifferenceAmount` BIGINT NOT NULL,
    `systemSaldoAmount` BIGINT NOT NULL,
    `actualSaldoAmount` BIGINT NOT NULL,
    `saldoDifferenceAmount` BIGINT NOT NULL,
    `feeAmount` BIGINT NOT NULL,
    `danaLuarAmount` BIGINT NOT NULL,
    `injectionAmount` BIGINT NOT NULL,
    `status` ENUM('POSTED', 'CANCELLED') NOT NULL DEFAULT 'POSTED',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BrilinkClosing_documentNo_key`(`documentNo`),
    INDEX `BrilinkClosing_operationalDate_idx`(`operationalDate`),
    UNIQUE INDEX `BrilinkClosing_operationalDate_status_key`(`operationalDate`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsignmentEntry` (
    `id` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `partnerId` VARCHAR(191) NOT NULL,
    `partnerNameSnapshot` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `qtyReceived` DECIMAL(18, 3) NOT NULL,
    `qtySold` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `qtyReturned` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `qtyPaid` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `unitCostAmount` BIGINT NOT NULL,
    `status` ENUM('ACTIVE', 'SETTLED', 'RETURNED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ConsignmentEntry_documentNo_key`(`documentNo`),
    INDEX `ConsignmentEntry_domain_idx`(`domain`),
    INDEX `ConsignmentEntry_partnerId_idx`(`partnerId`),
    INDEX `ConsignmentEntry_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsignmentPayment` (
    `id` VARCHAR(191) NOT NULL,
    `entryId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `qtyPaid` DECIMAL(18, 3) NOT NULL,
    `amount` BIGINT NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ConsignmentPayment_documentNo_key`(`documentNo`),
    INDEX `ConsignmentPayment_entryId_idx`(`entryId`),
    INDEX `ConsignmentPayment_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsignmentReturn` (
    `id` VARCHAR(191) NOT NULL,
    `entryId` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `operationalDate` DATE NOT NULL,
    `qtyReturned` DECIMAL(18, 3) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ConsignmentReturn_documentNo_key`(`documentNo`),
    INDEX `ConsignmentReturn_entryId_idx`(`entryId`),
    INDEX `ConsignmentReturn_operationalDate_idx`(`operationalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReversalRecord` (
    `id` VARCHAR(191) NOT NULL,
    `documentNo` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ReversalRecord_documentNo_key`(`documentNo`),
    INDEX `ReversalRecord_domain_idx`(`domain`),
    INDEX `ReversalRecord_sourceType_sourceId_idx`(`sourceType`, `sourceId`),
    UNIQUE INDEX `ReversalRecord_domain_sourceType_sourceId_key`(`domain`, `sourceType`, `sourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiSession` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ApiSession_tokenHash_key`(`tokenHash`),
    INDEX `ApiSession_userId_idx`(`userId`),
    INDEX `ApiSession_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceSetting` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `radiusMeters` INTEGER NOT NULL DEFAULT 100,
    `qrTtlSeconds` INTEGER NOT NULL DEFAULT 60,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `AttendanceSetting_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceQrToken` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AttendanceQrToken_tokenHash_key`(`tokenHash`),
    INDEX `AttendanceQrToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceRecord` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `attendanceDate` DATE NOT NULL,
    `checkInAt` DATETIME(3) NULL,
    `checkInLatitude` DECIMAL(10, 7) NULL,
    `checkInLongitude` DECIMAL(10, 7) NULL,
    `checkInDistanceM` INTEGER NULL,
    `checkOutAt` DATETIME(3) NULL,
    `checkOutLatitude` DECIMAL(10, 7) NULL,
    `checkOutLongitude` DECIMAL(10, 7) NULL,
    `checkOutDistanceM` INTEGER NULL,
    `status` ENUM('CHECKED_IN', 'CHECKED_OUT', 'CORRECTED', 'CANCELLED') NOT NULL DEFAULT 'CHECKED_IN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AttendanceRecord_attendanceDate_idx`(`attendanceDate`),
    INDEX `AttendanceRecord_status_idx`(`status`),
    UNIQUE INDEX `AttendanceRecord_userId_attendanceDate_key`(`userId`, `attendanceDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceCorrection` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `oldValue` JSON NOT NULL,
    `newValue` JSON NOT NULL,
    `correctedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AttendanceCorrection_recordId_idx`(`recordId`),
    INDEX `AttendanceCorrection_correctedBy_idx`(`correctedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `domain` ENUM('GLOBAL', 'WARUNG', 'BRILINK') NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `entityNo` VARCHAR(191) NULL,
    `actorId` VARCHAR(191) NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_domain_module_idx`(`domain`, `module`),
    INDEX `AuditLog_actorId_idx`(`actorId`),
    INDEX `AuditLog_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermissionOverride` ADD CONSTRAINT `UserPermissionOverride_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermissionOverride` ADD CONSTRAINT `UserPermissionOverride_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginHistory` ADD CONSTRAINT `LoginHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeviceHistory` ADD CONSTRAINT `DeviceHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungStockProduct` ADD CONSTRAINT `WarungStockProduct_baseUnitId_fkey` FOREIGN KEY (`baseUnitId`) REFERENCES `WarungUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungProductUnitConversion` ADD CONSTRAINT `WarungProductUnitConversion_stockProductId_fkey` FOREIGN KEY (`stockProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungProductUnitConversion` ADD CONSTRAINT `WarungProductUnitConversion_fromUnitId_fkey` FOREIGN KEY (`fromUnitId`) REFERENCES `WarungUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungProductUnitConversion` ADD CONSTRAINT `WarungProductUnitConversion_toUnitId_fkey` FOREIGN KEY (`toUnitId`) REFERENCES `WarungUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSellableItem` ADD CONSTRAINT `WarungSellableItem_stockProductId_fkey` FOREIGN KEY (`stockProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSellableItem` ADD CONSTRAINT `WarungSellableItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `WarungProductCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungItemComposition` ADD CONSTRAINT `WarungItemComposition_sellableItemId_fkey` FOREIGN KEY (`sellableItemId`) REFERENCES `WarungSellableItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungItemComposition` ADD CONSTRAINT `WarungItemComposition_componentProductId_fkey` FOREIGN KEY (`componentProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungStockMovement` ADD CONSTRAINT `WarungStockMovement_stockProductId_fkey` FOREIGN KEY (`stockProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungStockOpnameItem` ADD CONSTRAINT `WarungStockOpnameItem_opnameId_fkey` FOREIGN KEY (`opnameId`) REFERENCES `WarungStockOpname`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungStockOpnameItem` ADD CONSTRAINT `WarungStockOpnameItem_stockProductId_fkey` FOREIGN KEY (`stockProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSale` ADD CONSTRAINT `WarungSale_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `WarungPaymentMethod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSaleItem` ADD CONSTRAINT `WarungSaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `WarungSale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSaleItem` ADD CONSTRAINT `WarungSaleItem_sellableItemId_fkey` FOREIGN KEY (`sellableItemId`) REFERENCES `WarungSellableItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSaleItem` ADD CONSTRAINT `WarungSaleItem_stockProductId_fkey` FOREIGN KEY (`stockProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungPurchaseItem` ADD CONSTRAINT `WarungPurchaseItem_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `WarungPurchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungPurchaseItem` ADD CONSTRAINT `WarungPurchaseItem_stockProductId_fkey` FOREIGN KEY (`stockProductId`) REFERENCES `WarungStockProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSupplierDebt` ADD CONSTRAINT `WarungSupplierDebt_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `WarungPurchase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungSupplierDebtPayment` ADD CONSTRAINT `WarungSupplierDebtPayment_debtId_fkey` FOREIGN KEY (`debtId`) REFERENCES `WarungSupplierDebt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungExpense` ADD CONSTRAINT `WarungExpense_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `WarungExpenseCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarungNonCashLedger` ADD CONSTRAINT `WarungNonCashLedger_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `WarungPaymentMethod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkTransactionType` ADD CONSTRAINT `BrilinkTransactionType_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `BrilinkCashSaldoTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkTariffGroup` ADD CONSTRAINT `BrilinkTariffGroup_transactionTypeId_fkey` FOREIGN KEY (`transactionTypeId`) REFERENCES `BrilinkTransactionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkTariffRange` ADD CONSTRAINT `BrilinkTariffRange_tariffGroupId_fkey` FOREIGN KEY (`tariffGroupId`) REFERENCES `BrilinkTariffGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkTransaction` ADD CONSTRAINT `BrilinkTransaction_transactionTypeId_fkey` FOREIGN KEY (`transactionTypeId`) REFERENCES `BrilinkTransactionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkCashLedger` ADD CONSTRAINT `BrilinkCashLedger_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `BrilinkTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkSaldoLedger` ADD CONSTRAINT `BrilinkSaldoLedger_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `BrilinkTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkFeeLedger` ADD CONSTRAINT `BrilinkFeeLedger_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `BrilinkTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkDanaLuarReturn` ADD CONSTRAINT `BrilinkDanaLuarReturn_danaLuarId_fkey` FOREIGN KEY (`danaLuarId`) REFERENCES `BrilinkDanaLuar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrilinkInjectionReturn` ADD CONSTRAINT `BrilinkInjectionReturn_injectionId_fkey` FOREIGN KEY (`injectionId`) REFERENCES `BrilinkInjection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsignmentPayment` ADD CONSTRAINT `ConsignmentPayment_entryId_fkey` FOREIGN KEY (`entryId`) REFERENCES `ConsignmentEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsignmentReturn` ADD CONSTRAINT `ConsignmentReturn_entryId_fkey` FOREIGN KEY (`entryId`) REFERENCES `ConsignmentEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiSession` ADD CONSTRAINT `ApiSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceCorrection` ADD CONSTRAINT `AttendanceCorrection_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `AttendanceRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

