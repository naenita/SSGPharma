-- CreateTable Category
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable Product
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT,
    "manufacturer" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pricePaise" INTEGER NOT NULL,
    "mrpPaise" INTEGER,
    "dosage" TEXT,
    "packSize" TEXT,
    "salts" TEXT,
    "description" TEXT,
    "keyBenefits" TEXT,
    "goodToKnow" TEXT,
    "dietType" TEXT,
    "productForm" TEXT,
    "allergiesInformation" TEXT,
    "directionForUse" TEXT,
    "safetyInformation" TEXT,
    "schema" TEXT,
    "specialBenefitSchemes" TEXT,
    "faqs" TEXT,
    "imageUrl1" TEXT,
    "imageUrl2" TEXT,
    "imageUrl3" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable Molecule
CREATE TABLE "Molecule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "synonyms" TEXT,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "overview" TEXT,
    "backgroundAndApproval" TEXT,
    "uses" TEXT,
    "administration" TEXT,
    "sideEffects" TEXT,
    "warnings" TEXT,
    "precautions" TEXT,
    "expertTips" TEXT,
    "faqs" TEXT,
    "references" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable ProductMolecule
CREATE TABLE "ProductMolecule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "moleculeId" TEXT NOT NULL,
    "quantity" TEXT,
    CONSTRAINT "ProductMolecule_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductMolecule_moleculeId_fkey" FOREIGN KEY ("moleculeId") REFERENCES "Molecule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Molecule_slug_key" ON "Molecule"("slug");

-- CreateIndex
CREATE INDEX "Molecule_slug_idx" ON "Molecule"("slug");

-- CreateIndex
CREATE INDEX "Molecule_isPublished_idx" ON "Molecule"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ProductMolecule_productId_moleculeId_key" ON "ProductMolecule"("productId", "moleculeId");

-- CreateIndex
CREATE INDEX "ProductMolecule_productId_idx" ON "ProductMolecule"("productId");

-- CreateIndex
CREATE INDEX "ProductMolecule_moleculeId_idx" ON "ProductMolecule"("moleculeId");
