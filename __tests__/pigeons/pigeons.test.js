import request from 'supertest';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import app from '../../src/server.js';

import { beforeEach, afterEach, describe, it, expect } from '@jest/globals';

dotenv.config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe('GET /api/pigeons', () => {
  it('Should return all pigeons', async () => {
    const res = await request(app).get('/api/pigeons');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // it('Should return a single pigeon', async () => {
  //   const res = await request(app).get(`/api/pigeon/${id}`)
  // });
});
