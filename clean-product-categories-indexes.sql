-- Script to remove ALL non-essential indexes from ProductCategories table
-- Run this in your MySQL database to fix the "Too many keys" error

-- STEP 1: See all current indexes (run this first)
SHOW INDEXES FROM `ProductCategories`;

-- STEP 2: Drop all indexes except PRIMARY
-- Common index names to drop (uncomment the ones that exist in STEP 1):

-- Drop indexes on individual columns
DROP INDEX IF EXISTS `ProductCategories_title` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_slug` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_displayOrder` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_status` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_description` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_imgSrc` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_createdAt` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_updatedAt` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_productCategoryId` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_productSubcategoryId` ON `ProductCategories`;

-- Drop foreign key indexes (if they exist separately)
DROP INDEX IF EXISTS `ProductCategories_productCategoryId_foreign_idx` ON `ProductCategories`;
DROP INDEX IF EXISTS `ProductCategories_productSubcategoryId_foreign_idx` ON `ProductCategories`;

-- STEP 3: Verify only PRIMARY index remains
SHOW INDEXES FROM `ProductCategories`;
-- Should only show PRIMARY index

-- STEP 6: Make sure productCategoryGroupId column exists
-- If it doesn't exist, add it:
-- ALTER TABLE `ProductCategories` 
-- ADD COLUMN `productCategoryGroupId` INTEGER NOT NULL DEFAULT 1;

-- If it exists but is NULL, update it:
-- UPDATE `ProductCategories` SET `productCategoryGroupId` = 1 WHERE `productCategoryGroupId` IS NULL;
-- ALTER TABLE `ProductCategories` MODIFY COLUMN `productCategoryGroupId` INTEGER NOT NULL;

-- STEP 7: Now add the foreign key (should work now)
ALTER TABLE `ProductCategories` 
ADD CONSTRAINT `ProductCategories_productCategoryGroupId_foreign_idx` 
FOREIGN KEY (`productCategoryGroupId`) 
REFERENCES `ProductCategoryGroups` (`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
