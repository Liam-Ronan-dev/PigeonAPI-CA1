import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { User } from '../src/models/User.js';
import { RaceHistory } from '../src/models/RaceHistory.js';
import { Pigeon } from '../src/models/Pigeon.js';

let token;
let testUser;
let pigeonId;
let raceId;

beforeAll(async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('testRace', 10);
  testUser = await User.create({
    username: 'testRace',
    email: 'testRace@example.com',
    password: hashedPassword,
  });

  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const uniqueRingNumber = `P${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const pigeon = await Pigeon.create({
    name: 'Rocky',
    ringNumber: uniqueRingNumber,
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
  await RaceHistory.deleteMany({});
  await disconnectDB();
});

describe('Race Histories API', () => {
  it('Should create a new Race with valid JWT', async () => {
    const raceData = {
      raceName: 'Short 200',
      date: '2022-04-11',
      distance: '200 miles',
      positions: ['1st', '2nd', '3rd'],
      totalParticipants: 64,
      windSpeed: '100km/h',
      windDirection: 'S',
      notes: 'Some notes',
      pigeons: [pigeonId],
    };

    const res = await request(app)
      .post('/api/raceHistory')
      .set('Authorization', `Bearer ${token}`)
      .send(raceData);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('raceName', raceData.raceName);

    const responseDate = new Date(res.body.data.date)
      .toISOString()
      .split('T')[0];
    expect(responseDate).toBe(raceData.date);

    expect(res.body.data).toHaveProperty('distance', raceData.distance);
    expect(res.body.data.pigeons).toContainEqual(pigeonId.toString());

    raceId = res.body.data._id;
  });

  it('Should get all Races', async () => {
    const res = await request(app).get('/api/raceHistories');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('Should get a single Race by ID', async () => {
    const res = await request(app).get(`/api/raceHistory/${raceId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('raceName', 'Short 200');
  });

  it('Should update an existing Race with valid JWT', async () => {
    const updatedRaceData = {
      raceName: 'Short 300',
      date: '2022-03-02',
      distance: '300 miles',
      totalParticipants: 70,
      windSpeed: '120km/h',
      notes: 'Updated race notes',
    };

    const res = await request(app)
      .put(`/api/raceHistory/${raceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedRaceData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('raceName', updatedRaceData.raceName);
    expect(res.body.data).toHaveProperty('distance', updatedRaceData.distance);
    expect(res.body.data).toHaveProperty(
      'totalParticipants',
      updatedRaceData.totalParticipants
    );
  });

  it('Should delete an existing Race with valid JWT', async () => {
    const res = await request(app)
      .delete(`/api/raceHistory/${raceId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Race Short 300 deleted successfully');

    const getRes = await request(app).get(`/api/raceHistory/${raceId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
