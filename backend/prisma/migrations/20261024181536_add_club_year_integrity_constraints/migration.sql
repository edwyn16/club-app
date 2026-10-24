-- Enforce one active, non-deleted operating year per club.
CREATE UNIQUE INDEX "club_years_one_active_per_club"
ON "club_years" ("club_id")
WHERE "status" = 'ACTIVE'
  AND "deleted_at" IS NULL;

-- Enforce valid operating-year date ranges.
ALTER TABLE "club_years"
ADD CONSTRAINT "club_years_valid_date_range"
CHECK ("start_date" < "end_date");
