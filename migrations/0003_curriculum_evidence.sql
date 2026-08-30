-- PRD 2022 curriculum Phase 4: evidence-backed problem-family registry.
CREATE TABLE curriculum_evidence (
  id TEXT PRIMARY KEY,
  unit_id TEXT UNIQUE NOT NULL,
  source_type TEXT NOT NULL,
  source_reference TEXT NOT NULL,
  source_rights TEXT NOT NULL,
  problem_type TEXT NOT NULL,
  fixed_elements_json TEXT NOT NULL,
  variables_json TEXT NOT NULL,
  constraints_json TEXT NOT NULL,
  solution_rule TEXT NOT NULL,
  answer_validation TEXT NOT NULL,
  difficulty_rules_json TEXT NOT NULL,
  evidence_status TEXT NOT NULL CHECK (evidence_status IN ('catalogued','sourced','analyzed','implemented','validated','localized','published')),
  validation_status TEXT NOT NULL CHECK (validation_status IN ('not-validated','pending','passed','failed')) DEFAULT 'not-validated',
  display_review_status TEXT NOT NULL CHECK (display_review_status IN ('not-reviewed','pending','passed','failed')) DEFAULT 'not-reviewed',
  visibility TEXT NOT NULL CHECK (visibility IN ('admin-preview','public')) DEFAULT 'admin-preview',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_curriculum_evidence_status ON curriculum_evidence(evidence_status, validation_status, display_review_status);
CREATE INDEX idx_curriculum_evidence_visibility ON curriculum_evidence(visibility);
