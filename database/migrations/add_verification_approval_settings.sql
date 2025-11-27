-- Add verification approval workflow settings

ALTER TABLE settings
ADD COLUMN allow_edit_verified_items BOOLEAN DEFAULT FALSE
  COMMENT 'Whether verified items can be edited on Means of Verification page',
ADD COLUMN show_verification_approval_on_original_page BOOLEAN DEFAULT TRUE
  COMMENT 'Whether to show verify/reject buttons on Means of Verification page or only on Approvals page';

-- Set default values for existing record
UPDATE settings
SET
  allow_edit_verified_items = FALSE,
  show_verification_approval_on_original_page = TRUE
WHERE id = 1;
