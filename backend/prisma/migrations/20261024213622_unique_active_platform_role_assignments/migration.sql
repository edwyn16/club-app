CREATE UNIQUE INDEX "user_platform_roles_active_assignment_unique"
ON "user_platform_roles" ("user_id", "role_id")
WHERE "deleted_at" IS NULL;