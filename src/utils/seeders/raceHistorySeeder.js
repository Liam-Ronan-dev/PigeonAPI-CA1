import { faker } from '@faker-js/faker';
import { Pigeon } from '../../models/Pigeon.js';
import { RaceHistory } from '../../models/RaceHistory.js';

export const seedRaceHistory = async () => {
  try {
    await RaceHistory.deleteMany();

    const pigeons = await Pigeon.find();

    if (pigeons.length === 0) {
      console.error('No pigeons found, seed the pigeons first');
      return;
    }

    const raceHistories = [];
    let numberOfRaceHistories = process.argv[3];

    if (numberOfRaceHistories === undefined) {
      numberOfRaceHistories = 3;
    }

    for (let i = 0; i < numberOfRaceHistories; i++) {
      raceHistories.push({
        raceName: `${faker.lorem.word()} race`,
        date: faker.date.past(),
        distance: `${faker.number.int({ min: 50, max: 2000 })} miles`,
        positions: faker.helpers.multiple(
          () =>
            faker.helpers.arrayElement([
              '1st',
              '2nd',
              '3rd',
              '4th',
              '5th',
              '6th',
              '7th',
            ]),
          { count: { min: 1, max: 6 } }
        ),
        totalParticipants: faker.number.int({ min: 32, max: 145 }),
        windSpeed: `${faker.number.int({ min: 0, max: 100 })} km/h`,
        windDirection: faker.helpers.arrayElement([
          'N',
          'NE',
          'E',
          'SE',
          'S',
          'SW',
          'W',
          'NW',
        ]),
        pigeons: faker.helpers
          .shuffle(pigeons)
          .slice(
            0,
            faker.number.int({ min: 1, max: Math.min(6, pigeons.length) })
          )
          .map((pigeon) => pigeon._id),
        notes: faker.lorem.paragraph(),
      });
    }

    await RaceHistory.insertMany(raceHistories);
    console.log(`${numberOfRaceHistories} race histories seeded successfully`);
  } catch (error) {
    console.error(`Error seeding race histories: ${error}`);
  }
};
