import 'dotenv/config';
import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Configuration pour éviter les problèmes de dates avec PostgreSQL
types.setTypeParser(1114, (str) => str);

async function main() {
  console.log("⏳ Début du script de Seed...");

  // 1. On utilise un Pool pour plus de stabilité sur les connexions distantes
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000, // On laisse un peu plus de temps (réseau)
  });

  const adapter = new PrismaPg(pool);
  
  // 2. Pour Prisma 7, l'adapter est OBLIGATOIRE si défini dans le schema
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await bcrypt.hash("wigo123", 10);

    // --- Ton code de création (Conducteur) ---
    const driver = await prisma.user.upsert({
      where: { email: 'driver@wigo.com' },
      update: {},
      create: {
        name: 'Alex Conducteur',
        email: 'driver@wigo.com',
        password: passwordHash,
        isDriver: true,
        idVerified: true,
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
            country: 'France',
            documentUrl: 'https://example.com/driver-license.jpg',
          }
        },
        vehicles: {
          create: {
            make: 'Mercedes-Benz',
            model: 'Classe E',
            year: 2024,
            licensePlate: 'BW-512-AZ',
            color: 'Noir',
            seatsCapacity: 4,
          }
        }
      },
    });
    console.log(`✅ Conducteur créé : ${driver.email}`);

    // --- Ton code de création (Passager) ---
    const passenger = await prisma.user.upsert({
      where: { email: 'passenger@wigo.com' },
      update: {},
      create: {
        name: 'Sarah Passager',
        email: 'passenger@wigo.com',
        password: passwordHash,
        isDriver: false,
        idVerified: true,
        kycVerifications: {
          create: [
            { type: 'ID', status: 'APPROVED', documentUrl: 'https://example.com/passenger-id.jpg' }
          ]
        }
      },
    });
    console.log(`✅ Passager créé : ${passenger.email}`);
    
    console.log("🏁 Seeding terminé avec succès !");

  } catch (error) {
    console.error("❌ Erreur pendant le seeding :");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Important pour libérer la connexion
  }
}

main();