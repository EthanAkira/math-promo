-- Add EBSi/KICE accuracy and error rate statistics to archive_problems
ALTER TABLE archive_problems ADD COLUMN correct_rate REAL;
ALTER TABLE archive_problems ADD COLUMN error_rate REAL;
ALTER TABLE archive_problems ADD COLUMN choice_ratios_json TEXT;
