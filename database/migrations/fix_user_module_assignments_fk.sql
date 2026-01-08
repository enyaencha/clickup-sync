-- Fix foreign key constraint in user_module_assignments table
-- Issue: module_id references programs table but should reference program_modules table

-- Step 1: Drop the incorrect foreign key constraint
ALTER TABLE `user_module_assignments`
DROP FOREIGN KEY `user_module_assignments_ibfk_2`;

-- Step 2: Add the correct foreign key constraint pointing to program_modules
ALTER TABLE `user_module_assignments`
ADD CONSTRAINT `user_module_assignments_ibfk_2`
FOREIGN KEY (`module_id`) REFERENCES `program_modules` (`id`) ON DELETE CASCADE;

-- Step 3: Update the comment to reflect the correct table
ALTER TABLE `user_module_assignments`
MODIFY COLUMN `module_id` INT NOT NULL COMMENT 'References program_modules table';
