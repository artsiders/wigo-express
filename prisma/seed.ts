import 'dotenv/config';
import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Configuration pour éviter les problèmes de dates avec PostgreSQL
types.setTypeParser(1114, (str) => str);

async function main() {
  console.log("⏳ Début du script de Seed...");

  // 1. Pool connexion
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await bcrypt.hash("wigo123", 10);

    // ==========================================
    // 1. CONDUCTEUR PREMIUM (Alexandre)
    // ==========================================
    const driver1 = await prisma.user.upsert({
      where: { email: 'alex@wigo.com' },
      update: {},
      create: {
        name: 'Alexandre Tremblay',
        email: 'alex@wigo.com',
        password: passwordHash,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        isDriver: true,
        idVerified: true,
        rating: 4.9,
        reviewsCount: 124,
        totalRides: 142,
        bio: 'Bonjour ! Je fais ce trajet toutes les semaines pour mon travail. J\'aime discuter de tech et écouter des podcasts. Soyez les bienvenus !',
        kycVerifications: {
          create: [
            { type: 'ID', status: 'APPROVED', documentUrl: 'https://example.com/driver-id.jpg' },
            { type: 'LICENSE', status: 'APPROVED', documentUrl: 'https://example.com/driver-license.jpg' }
          ]
        },
        license: {
          create: {
            number: 'DRV-123456789',
            expiryDate: new Date('2032-12-31'),
            country: 'Canada',
            documentUrl: 'https://example.com/driver-license.jpg',
          }
        },
        vehicles: {
          create: {
            make: 'Toyota',
            model: 'Camry',
            year: 2021,
            licensePlate: 'X8Y-123',
            color: 'Gris Palladium',
            seatsCapacity: 4,
            photo: '/images/wigo-express-red-card.jpg', // Vous pouvez mettre une URL web Unsplash
            features: ['Climatisation', 'Sièges en cuir', 'Bluetooth']
          }
        }
      },
      include: { vehicles: true }
    });
    console.log(`✅ Conducteur·rice Premium créé : ${driver1.email}`);

    // ==========================================
    // 2. CONDUCTRICE (Sophie)
    // ==========================================
    const driver2 = await prisma.user.upsert({
      where: { email: 'sophie@wigo.com' },
      update: {},
      create: {
        name: 'Sophie Laurent',
        email: 'sophie@wigo.com',
        password: passwordHash,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        isDriver: true,
        idVerified: true,
        rating: 5.0,
        reviewsCount: 89,
        totalRides: 28,
        bio: 'Étudiante en médecine, j\'aime les trajets calmes pour me reposer ou réviser sans bruit.',
        vehicles: {
          create: {
            make: 'Honda',
            model: 'Civic',
            year: 2019,
            licensePlate: 'ABC-987',
            color: 'Blanc',
            seatsCapacity: 3,
            features: ['Musique douce', 'Sièges chauffants']
          }
        }
      },
      include: { vehicles: true }
    });
    console.log(`✅ Conductrice créée : ${driver2.email}`);

    // ==========================================
    // 3. PASSAGER (Test User)
    // ==========================================
    const passenger = await prisma.user.upsert({
      where: { email: 'passenger@wigo.com' },
      update: {},
      create: {
        name: 'Sarah Passager',
        email: 'passenger@wigo.com',
        password: passwordHash,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        isDriver: false,
        idVerified: true,
        rating: 4.8,
        reviewsCount: 12,
        totalRides: 0,
        kycVerifications: {
          create: [
            { type: 'ID', status: 'APPROVED', documentUrl: 'https://example.com/passenger-id.jpg' }
          ]
        }
      },
    });
    console.log(`✅ Passager créé : ${passenger.email}`);

    // ==========================================
    // 4. TRAJETS (Trips)
    // ==========================================
    // Trajet 1: Alex (Montréal -> Québec)
    const trip1 = await prisma.trip.create({
      data: {
        driverId: driver1.id,
        vehicleId: driver1.vehicles[0].id,
        departureCity: 'Montréal, QC',
        arrivalCity: 'Québec, QC',
        departurePlace: 'Station Berri-UQAM (côté Émilie-Gamelin)',
        arrivalPlace: 'Gare du Palais (Entrée principale)',
        departureDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
        duration: '3h15',
        price: 45.0,
        totalSeats: 3,
        availableSeats: 2, // 1 siège déjà réservé !
        status: 'SCHEDULED',
        instantBooking: true,
        max2Back: true,
        luggage: true,
        smoking: false,
        pet: false,
      }
    });

    // Trajet 2: Sophie (Québec -> Trois-Rivières)
    const trip2 = await prisma.trip.create({
      data: {
        driverId: driver2.id,
        vehicleId: driver2.vehicles[0].id,
        departureCity: 'Québec, QC',
        arrivalCity: 'Trois-Rivières, QC',
        departurePlace: 'Shell, Boul. Laurier (Sainte-Foy)',
        arrivalPlace: 'UQTR - Cubes',
        departureDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
        duration: '1h45',
        price: 19.0,
        totalSeats: 3,
        availableSeats: 3,
        status: 'SCHEDULED',
        instantBooking: false,
        max2Back: true,
        luggage: true,
        smoking: false,
        pet: false,
      }
    });

    // Trajet 3: Passé et Terminé (Alex, Historique)
    const trip3 = await prisma.trip.create({
      data: {
        driverId: driver1.id,
        vehicleId: driver1.vehicles[0].id,
        departureCity: 'Québec, QC',
        arrivalCity: 'Montréal, QC',
        departurePlace: 'Gare Sainte-Foy',
        arrivalPlace: 'Centre Bell',
        departureDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
        duration: '3h00',
        price: 40.0,
        totalSeats: 3,
        availableSeats: 0,
        status: 'COMPLETED',
        instantBooking: true,
        max2Back: true,
        luggage: true,
        smoking: false,
        pet: false,
      }
    });
    console.log(`✅ 3 Trajets créés (2 à venir, 1 complété)`);

    // ==========================================
    // 5. RÉSERVATIONS (Bookings)
    // ==========================================
    // Sarah réserve 1 place dans le Trajet 1 d'Alex
    await prisma.booking.create({
      data: {
        tripId: trip1.id,
        passengerId: passenger.id,
        bookedSeats: 1,
        totalPrice: 45.0 * 1.1, // avec fee
        status: 'CONFIRMED'
      }
    });

    // Sarah avait réservé dans le trajet passé d'Alex
    await prisma.booking.create({
      data: {
        tripId: trip3.id,
        passengerId: passenger.id,
        bookedSeats: 1,
        totalPrice: 44.0, 
        status: 'CONFIRMED'
      }
    });
    console.log(`✅ Réservations créées pour le passager de test`);

    console.log("🏁 Seeding terminé avec succès et de manière optimale !");

  } catch (error) {
    console.error("❌ Erreur pendant le seeding :");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();