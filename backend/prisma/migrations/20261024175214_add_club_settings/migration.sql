-- CreateTable
CREATE TABLE "club_settings" (
    "id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "logo_url" TEXT,
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "club_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "club_settings_club_id_key" ON "club_settings"("club_id");

-- AddForeignKey
ALTER TABLE "club_settings" ADD CONSTRAINT "club_settings_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
