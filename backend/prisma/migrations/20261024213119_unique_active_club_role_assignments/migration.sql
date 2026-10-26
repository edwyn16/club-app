CREATE UNIQUE INDEX "user_club_roles_active_assignment_unique"
ON "user_club_roles" ("user_id", "club_id", "role_id")
WHERE "deleted_at" IS NULL;