import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect } from '@jest/globals';

describe('Error Handler Middleware', () => {
  // Test case for triggering an error and checking the response
  it('Should return 500 and error message when an error is triggered', async () => {
    const res = await request(app).get('/error');

    // Assertions
    expect(res.statusCode).toBe(500); // Check if the response status is 500
    expect(res.body).toHaveProperty('message'); // Check if a message property is present
    expect(res.body.message).toBe('This is a test error!'); // Check if the message is correct
  });
});
