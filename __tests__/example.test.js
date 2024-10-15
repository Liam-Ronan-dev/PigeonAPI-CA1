import { minus, sum, multiply } from './tests.js';
import { describe, it, expect } from '@jest/globals';

describe('Example Tests', () => {
  it('Should minus two numbers', () => {
    expect(minus(4, 2)).toBe(2);
  });

  it('Should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('Should multiply two numbers', () => {
    expect(multiply(2, 4)).toBe(8);
  });
});
