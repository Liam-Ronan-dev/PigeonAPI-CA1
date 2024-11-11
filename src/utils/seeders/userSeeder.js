import { faker } from '@faker-js/faker';
import { User } from '../../models/User.js';

export const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [];
    let numberOfUsers = process.argv[3];

    if (numberOfUsers === undefined) {
      numberOfUsers = 3;
    }

    for (let i = 0; i < numberOfUsers; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    }

    await User.insertMany(users);
    console.log(`${numberOfUsers} users seeded successfully`);
  } catch (error) {
    console.error(`Error seeding Users: ${error}`);
  }
};
