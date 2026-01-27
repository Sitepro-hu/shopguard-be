-- Script to drop ALL slug indexes from ProductCategories table
-- These were created by Sequelize trying to add unique constraint multiple times

-- Drop all slug-related indexes (slug, slug_2, slug_3, etc.)
DROP INDEX IF EXISTS `slug` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_2` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_3` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_4` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_5` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_6` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_7` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_8` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_9` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_10` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_11` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_12` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_13` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_14` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_15` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_16` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_17` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_18` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_19` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_20` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_21` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_22` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_23` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_24` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_25` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_26` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_27` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_28` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_29` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_30` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_31` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_32` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_33` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_34` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_35` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_36` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_37` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_38` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_39` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_40` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_41` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_42` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_43` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_44` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_45` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_46` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_47` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_48` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_49` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_50` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_51` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_52` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_53` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_54` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_55` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_56` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_57` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_58` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_59` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_60` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_61` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_62` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_63` ON `ProductCategories`;
DROP INDEX IF EXISTS `slug_64` ON `ProductCategories`;

-- Verify indexes are dropped
SHOW INDEXES FROM `ProductCategories`;

-- Now add the foreign key (should work now)
ALTER TABLE `ProductCategories` 
ADD CONSTRAINT `ProductCategories_productCategoryGroupId_foreign_idx` 
FOREIGN KEY (`productCategoryGroupId`) 
REFERENCES `ProductCategoryGroups` (`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
