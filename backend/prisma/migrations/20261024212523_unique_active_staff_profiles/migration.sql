CREATE UNIQUE INDEX "staff_profiles_active_user_club_unique"
ON "staff_profiles" ("user_id", "club_id")
WHERE "deleted_at" IS NULL;