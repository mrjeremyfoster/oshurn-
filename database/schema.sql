PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL,
  interest TEXT NOT NULL,
  contact_preference TEXT NOT NULL,
  timing TEXT,
  referral_source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_advisor_id TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS advisors (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  role TEXT NOT NULL DEFAULT 'advisor'
);

CREATE TABLE IF NOT EXISTS advisor_licenses (
  id TEXT PRIMARY KEY,
  advisor_id TEXT NOT NULL,
  state TEXT NOT NULL,
  license_type TEXT NOT NULL,
  license_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TEXT,
  FOREIGN KEY (advisor_id) REFERENCES advisors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lead_id TEXT,
  advisor_id TEXT,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  due_at TEXT,
  completed_at TEXT,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (advisor_id) REFERENCES advisors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL,
  lead_id TEXT,
  advisor_id TEXT,
  task_id TEXT,
  metadata_json TEXT,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (advisor_id) REFERENCES advisors(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_advisor ON leads(assigned_advisor_id);
CREATE INDEX IF NOT EXISTS idx_leads_state_interest ON leads(state, interest);
CREATE INDEX IF NOT EXISTS idx_tasks_advisor_status_due ON tasks(advisor_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON events(event_type, created_at);
