import { faker } from '@faker-js/faker';
import { Pigeon } from '../../models/Pigeon.js';
import { MedicalTreatment } from '../../models/MedicalTreatment.js';

export const seedMedicalHistory = async () => {
  try {
    await MedicalTreatment.deleteMany();

    const pigeons = await Pigeon.find();

    if (pigeons.length === 0) {
      console.error('No pigeons found, seed the pigeons first');
      return;
    }

    const medicalTreatments = [];
    const numberOfMedicalTreatments = process.argv[3];

    if (numberOfMedicalTreatments === undefined) {
      console.error('Number of Medical Treatments not specified');
      process.exit(1);
    }

    for (let i = 0; i < numberOfMedicalTreatments; i++) {
      medicalTreatments.push({
        treatmentName: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        dateAdministered: faker.date.past(),
        treatmentDuration: faker.helpers.arrayElement([
          `${faker.number.int({ min: 1, max: 365 })} days`,
          `${faker.number.int({ min: 1, max: 12 })} months`,
          `${faker.number.int({ min: 1, max: 10 })} years`,
        ]),
        pigeons: faker.helpers.arrayElement(pigeons)._id,
        administeredBy: `Dr. ${faker.person.fullName()}`,
      });
    }

    await MedicalTreatment.insertMany(medicalTreatments);
    console.log(
      `${numberOfMedicalTreatments} medical treatments seeded successfully`
    );
  } catch (error) {
    console.error(`Error seeding Medical Treatments: ${error}`);
  }
};
