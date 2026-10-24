-- CreateEnum
CREATE TYPE "ClubRegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "club_registration_requests" (
    "id" UUID NOT NULL,
    "proposed_club_name" TEXT NOT NULL,
    "club_type" "ClubType" NOT NULL,
    "applicant_name" TEXT NOT NULL,
    "applicant_email" TEXT NOT NULL,
    "church_id" UUID,
    "proposed_church_name" TEXT,
    "status" "ClubRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_at" TIMESTAMPTZ(3),
    "review_note" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "club_registration_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "club_registration_requests_church_id_idx" ON "club_registration_requests"("church_id");

-- CreateIndex
CREATE INDEX "club_registration_requests_status_idx" ON "club_registration_requests"("status");

-- AddForeignKey
ALTER TABLE "club_registration_requests" ADD CONSTRAINT "club_registration_requests_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
