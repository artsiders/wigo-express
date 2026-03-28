-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "arrivalPlace" TEXT,
ADD COLUMN     "departurePlace" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "instantBooking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "luggage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "max2Back" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smoking" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRides" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "features" TEXT[],
ADD COLUMN     "photo" TEXT;
