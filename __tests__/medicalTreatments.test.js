import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { User } from '../src/models/User.js';
import { MedicalTreatment } from '../src/models/MedicalTreatment.js';
import { Pigeon } from '../src/models/Pigeon.js';

let token;
let testUser;
let pigeonId;
let treatmentId;

beforeAll(async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('testMedical', 10);
  testUser = await User.create({
    username: 'testMedical',
    email: 'testMedical@example.com',
    password: hashedPassword,
  });

  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const pigeon = await Pigeon.create({
    name: 'Rocky',
    ringNumber: `P${Date.now()}`,
    sex: 'Hen',
    breed: 'Racing Pigeon',
    hatchDate: '2023-01-01',
    colour: 'Blue',
    eyeColour: 'Orange',
    bodyType: 'Slim',
    diet: 'Grains and Seeds',
    owner: testUser._id,
  });
  pigeonId = pigeon._id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Pigeon.deleteMany({});
  await MedicalTreatment.deleteMany({});
  await disconnectDB();
});

describe('Medical Treatments', () => {
  it('Should create a new medical treatment with valid JWT', async () => {
    const treatmentData = {
      treatmentName: 'Vitamin Boost',
      description: 'A treatment to boost immune system',
      dateAdministered: '2023-05-01',
      treatmentDuration: '7 days',
      pigeons: [pigeonId],
      administeredBy: 'Dr. John',
    };

    const res = await request(app)
      .post('/api/medicalTreatments')
      .set('Authorization', `Bearer ${token}`)
      .send(treatmentData);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty(
      'treatmentName',
      treatmentData.treatmentName
    );
    expect(res.body.data).toHaveProperty(
      'description',
      treatmentData.description
    );
    expect(res.body.data.pigeons).toContainEqual(pigeonId.toString());
    treatmentId = res.body.data._id;
  });

  it('Should get all Medical Treatments', async () => {
    const res = await request(app).get('/api/medicalTreatments');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('Should get single medical Treatment', async () => {
    const res = await request(app).get(`/api/medicalTreatment/${treatmentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.treatmentName).toEqual('Vitamin Boost');
  });

  it('Should update an existing medical Treatment', async () => {
    const updatedMedicalData = {
      treatmentName: 'Vitamin Boost New',
      description: 'A treatment to boost immune system',
      dateAdministered: '2024-05-01',
      treatmentDuration: '10 days',
    };

    const res = await request(app)
      .put(`/api/medicalTreatment/${treatmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMedicalData);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty(
      'treatmentName',
      updatedMedicalData.treatmentName
    );
    expect(res.body.data).toHaveProperty(
      'description',
      updatedMedicalData.description
    );
  });

  it('Should delete an existing medical treatment', async () => {
    const res = await request(app)
      .delete(`/api/medicalTreatment/${treatmentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(
      `Medical Treatment: Vitamin Boost New deleted successfully`
    );

    const getRes = await request(app).get(
      `/api/medicalTreatment/${treatmentId}`
    );
    expect(getRes.statusCode).toBe(404);
  });
});
