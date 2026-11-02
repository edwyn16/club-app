-- AlterTable
ALTER TABLE "role_permissions" ADD COLUMN     "access_scope" TEXT NOT NULL DEFAULT 'UNASSIGNED';
