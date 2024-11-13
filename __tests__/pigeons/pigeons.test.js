import request from 'supertest';
import app from '../../src/app.js';
import { connectDB, disconnectDB } from '../../src/config/db.js';

import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Pigeons /GET', () => {
  it('Should return an array of all pigeons', async () => {
    const res = await request(app).get('/api/pigeons');
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
