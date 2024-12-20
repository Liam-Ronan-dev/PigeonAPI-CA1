import { seedUsers } from './userSeeder.js';
import { seedPigeons } from './pigeonSeeder.js';
import { seedRaceHistory } from './raceHistorySeeder.js';
import { seedMedicalHistory } from './medicalHistorySeeder.js';
import { connectDB, disconnectDB } from '../../config/db.js';
import * as dotenv from 'dotenv';

dotenv.config();

const runSeeders = async () => {
  const seederArg = process.argv[2]; // Get the argument from command line (e.g., users, pigeons)

  await connectDB();

  try {
    switch (seederArg) {
      case 'users':
        await seedUsers();
        break;
      case 'pigeons':
        await seedPigeons();
        break;
      case 'racehistories':
        await seedRaceHistory();
        break;
      case 'medicaltreatments':
        await seedMedicalHistory();
        break;
      case 'all':
        await seedUsers();
        await seedPigeons();
        await seedRaceHistory();
        await seedMedicalHistory();
        break;
      default:
        await seedUsers();
        await seedPigeons();
        await seedRaceHistory();
        await seedMedicalHistory();
    }

    console.log('Seeding successfully completed');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

runSeeders().then(() => {
  disconnectDB();
});
