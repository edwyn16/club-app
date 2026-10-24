/*
  Warnings:

  - Added the required column `church_id` to the `clubs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `clubs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClubType" AS ENUM ('ADVENTURER', 'PATHFINDER');

-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "church_id" UUID NOT NULL,
ADD COLUMN     "type" "ClubType" NOT NULL;

-- CreateTable
CREATE TABLE "churches" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "churches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clubs_church_id_idx" ON "clubs"("church_id");

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
