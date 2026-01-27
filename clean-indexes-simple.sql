-- Simple script to remove indexes from ProductCategories table
-- First, run this to see what indexes exist:
-- SHOW INDEXES FROM `ProductCategories`;

-- Then manually drop each index (except PRIMARY)
-- Common index names to drop (uncomment the ones that exist):

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

-- After dropping indexes, verify:
-- SHOW INDEXES FROM `ProductCategories`;
-- Should only show PRIMARY index

-- Make sure productCategoryGroupId column exists
-- If it doesn't exist, uncomment and run:
-- ALTER TABLE `ProductCategories` 
-- ADD COLUMN `productCategoryGroupId` INTEGER NOT NULL DEFAULT 1;

-- If it exists but is NULL, uncomment and run:
-- UPDATE `ProductCategories` SET `productCategoryGroupId` = 1 WHERE `productCategoryGroupId` IS NULL;
-- ALTER TABLE `ProductCategories` MODIFY COLUMN `productCategoryGroupId` INTEGER NOT NULL;

-- Finally, add the foreign key
ALTER TABLE `ProductCategories` 
ADD CONSTRAINT `ProductCategories_productCategoryGroupId_foreign_idx` 
FOREIGN KEY (`productCategoryGroupId`) 
REFERENCES `ProductCategoryGroups` (`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
