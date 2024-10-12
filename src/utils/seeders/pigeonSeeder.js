import { faker } from '@faker-js/faker';
import { User } from '../../models/User.js';
import { Pigeon } from '../../models/Pigeon.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const seedPigeons = async () => {
  try {
    await Pigeon.deleteMany();

    const users = await User.find();

    if (users.length === 0) {
      console.error('No users found, seed the users first');
      return;
    }

    const pigeons = [];
    const numberOfPigeons = process.argv[3];

    if (numberOfPigeons === undefined) {
      console.error('Number of Pigeons not specified');
      process.exit(1);
    }

    for (let i = 0; i < numberOfPigeons; i++) {
      pigeons.push({
        name: faker.person.fullName(),
        ringNumber: faker.number.int() + faker.lorem.word(),
        sex: faker.helpers.arrayElement(['Hen', 'Cock']),
        breed: faker.lorem.word(),
        colour: faker.color.human(),
        eyeColour: faker.color.human(),
        bodyType: faker.helpers.arrayElement([
          'Athletic',
          'Large',
          'Small',
          'Wide',
          'big',
          'XLarge',
          'XSmall',
        ]),
        diet: faker.food.fruit() + ' ' + faker.food.ingredient(),
        hatchDate: faker.date.past(),
        owner: faker.helpers.arrayElement(users)._id,
      });
    }

    await Pigeon.insertMany(pigeons);
    console.log(`${numberOfPigeons} pigeons seeded successfully`);
  } catch (error) {
    console.error(`Error seeding pigeons: ${error}`);
  }
};
