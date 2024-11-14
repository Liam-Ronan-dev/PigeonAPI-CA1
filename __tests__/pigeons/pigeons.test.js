import request from 'supertest';
import app from '../../src/app.js';
import { connectDB, disconnectDB } from '../../src/config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  it,
  expect,
} from '@jest/globals';
import { User } from '../../src/models/User.js';
import { Pigeon } from '../../src/models/Pigeon.js';

let token;
let testUser;
let pigeonId;

beforeAll(async () => {
  await connectDB();

  // Create new user using bcrypt to hash the password
  const hashedPassword = await bcrypt.hash('password123', 10);
  testUser = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: hashedPassword,
  });

  // Generate JWT Token - using JWT secret from env
  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Seed a pigeon for each test to use
  const pigeon = await Pigeon.create({
    name: 'Rocky',
    ringNumber: `A${Date.now()}`,
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
  // Removing users and pigeons after tests
  await User.deleteMany({});
  await Pigeon.deleteMany({});
  await disconnectDB();
});

describe('Pigeons', () => {
  beforeEach(async () => {
    // Seed a pigeon for each test to use
    const pigeon = await Pigeon.create({
      name: 'Rocky',
      ringNumber: `A${Date.now()}`,
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

  afterEach(async () => {
    await Pigeon.deleteMany({});
  });

  it('Should return an array of all pigeons', async () => {
    const res = await request(app).get('/api/pigeons');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('Should get a single pigeon by id', async () => {
    const res = await request(app).get(`/api/pigeon/${pigeonId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toEqual('Rocky');
  });

  it('Should create a new pigeon with valid JWT', async () => {
    const pigeonData = {
      name: 'Rocky',
      ringNumber: `P${Date.now()}`,
      sex: 'Hen',
      breed: 'Racing Pigeon',
      hatchDate: '2023-01-01',
      colour: 'Blue',
      eyeColour: 'Orange',
      bodyType: 'Slim',
      diet: 'Grains and Seeds',
    };

    const res = await request(app)
      .post('/api/pigeon')
      .set('Authorization', `Bearer ${token}`) // Set the Authorization header with the token
      .field('name', pigeonData.name)
      .field('ringNumber', pigeonData.ringNumber)
      .field('sex', pigeonData.sex)
      .field('breed', pigeonData.breed)
      .field('hatchDate', pigeonData.hatchDate)
      .field('colour', pigeonData.colour)
      .field('eyeColour', pigeonData.eyeColour)
      .field('bodyType', pigeonData.bodyType)
      .field('diet', pigeonData.diet)
      .attach('imageUrl', '__tests__/pigeons/__images__/sample-image.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('name', pigeonData.name);
    expect(res.body.data).toHaveProperty('ringNumber', pigeonData.ringNumber);
  });

  it('Should update an existing pigeon with valid JWT', async () => {
    const updatedPigeonData = {
      name: 'Updated Rocky',
      ringNumber: 'JA2322',
      breed: 'Racing Pigeon Updated',
      diet: 'Updated Grains and Seeds',
      sex: 'Hen',
    };

    const res = await request(app)
      .put(`/api/pigeon/${pigeonId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', updatedPigeonData.name)
      .field('ringNumber', updatedPigeonData.ringNumber)
      .field('breed', updatedPigeonData.breed)
      .field('diet', updatedPigeonData.diet)
      .field('sex', updatedPigeonData.sex);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name', updatedPigeonData.name);
    expect(res.body.data).toHaveProperty(
      'ringNumber',
      updatedPigeonData.ringNumber
    );
  });

  it('Should delete an existing pigeon with valid JWT', async () => {
    const res = await request(app)
      .delete(`/api/pigeon/${pigeonId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Pigeon Rocky deleted successfully`);

    const getRes = await request(app).get(`/api/pigeon/${pigeonId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
