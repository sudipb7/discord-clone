/*
  Warnings:

  - Changed the type of `otp` on the `otps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "otps" DROP COLUMN "otp",
ADD COLUMN     "otp" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otps_email_otp_key" ON "otps"("email", "otp");
