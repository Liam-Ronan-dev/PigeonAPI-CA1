import { seedUsers } from './userSeeder.js';
import { seedPigeons } from './pigeonSeeder.js';
import { seedRaceHistory } from './raceHistorySeeder.js';
import { seedMedicalHistory } from './medicalHistorySeeder.js';
import { connectDB, disconnectDB } from '../../config/db.js';
import * as dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'testing') {
  const runTestSeeders = async () => {
    await connectDB(); // Connect to test DB (NODE_ENV should be 'testing' so MONGO_TEST_URL is used)

    try {
      console.log('Starting to seed test database...');

      // Seed data for test purposes
      await seedUsers();
      await seedPigeons();
      await seedRaceHistory();
      await seedMedicalHistory();

      console.log('Test database seeding successfully completed');
    } catch (error) {
      console.error('Error seeding test database:', error);
      process.exit(1);
    } finally {
      await disconnectDB(); // Make sure to disconnect after seeding
    }
  };

  runTestSeeders()
    .then(() => {
      console.log('Seeding successful!');
    })
    .catch((error) => {
      console.error('Failed to run test seeders:', error);
      process.exit(1);
    });
}
