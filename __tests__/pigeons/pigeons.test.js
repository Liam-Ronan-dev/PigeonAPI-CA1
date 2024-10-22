import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Close Mongoose connection and stop MongoDB Memory Server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/pigeons', () => {
  it('Should return all pigeons', async () => {
    const res = await request(app).get('/api/pigeons');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
