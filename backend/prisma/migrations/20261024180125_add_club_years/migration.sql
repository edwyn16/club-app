-- CreateEnum
CREATE TYPE "ClubYearStatus" AS ENUM ('PLANNED', 'ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "club_years" (
    "id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "ClubYearStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "club_years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "club_years_club_id_status_idx" ON "club_years"("club_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "club_years_club_id_name_key" ON "club_years"("club_id", "name");

-- AddForeignKey
ALTER TABLE "club_years" ADD CONSTRAINT "club_years_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
