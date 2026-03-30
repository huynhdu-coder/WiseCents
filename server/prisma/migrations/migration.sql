ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "notif_email_digest"    BOOLEAN   NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "notif_budget_alerts"   BOOLEAN   NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "notif_goal_alerts"     BOOLEAN   NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "notif_budget_threshold" DECIMAL(5,2) DEFAULT 80.00,
  ADD COLUMN IF NOT EXISTS "last_digest_sent"      TIMESTAMP(6);

CREATE TABLE IF NOT EXISTS "spending_alerts" (
  "alert_id"    SERIAL PRIMARY KEY,
  "user_id"     INTEGER NOT NULL REFERENCES "users"("user_id") ON DELETE CASCADE,
  "type"        VARCHAR(30) NOT NULL,
  "title"       VARCHAR(150) NOT NULL,
  "message"     TEXT NOT NULL,
  "is_read"     BOOLEAN NOT NULL DEFAULT false,
  "created_at"  TIMESTAMP(6) NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_spending_alerts_user" ON "spending_alerts"("user_id");
CREATE INDEX IF NOT EXISTS "idx_spending_alerts_read"  ON "spending_alerts"("user_id", "is_read");
