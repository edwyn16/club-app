-- CreateTable
CREATE TABLE "user_club_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_club_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_club_roles_user_id_club_id_idx" ON "user_club_roles"("user_id", "club_id");

-- CreateIndex
CREATE INDEX "user_club_roles_club_id_role_id_idx" ON "user_club_roles"("club_id", "role_id");

-- AddForeignKey
ALTER TABLE "user_club_roles" ADD CONSTRAINT "user_club_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_club_roles" ADD CONSTRAINT "user_club_roles_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_club_roles" ADD CONSTRAINT "user_club_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
