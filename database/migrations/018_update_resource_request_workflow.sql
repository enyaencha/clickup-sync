-- Update resource request workflow statuses and comment entity types

ALTER TABLE `resource_requests`
MODIFY COLUMN `status` ENUM('pending', 'approved', 'allocated', 'returned', 'rejected', 'in_use', 'completed', 'cancelled') DEFAULT 'pending';

ALTER TABLE `resource_requests`
MODIFY COLUMN `request_type` ENUM('allocation', 'booking', 'purchase', 'procurement', 'maintenance', 'replacement', 'disposal') NOT NULL;

ALTER TABLE `comments`
MODIFY COLUMN `entity_type` ENUM(
  'activity',
  'goal',
  'sub_program',
  'component',
  'approval',
  'finance_approval',
  'budget_request',
  'checklist',
  'expense',
  'risk',
  'resource_request'
) NOT NULL;
