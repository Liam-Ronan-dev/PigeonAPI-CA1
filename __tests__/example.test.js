import { minus, sum } from './tests.js';

describe('Example Tests', () => {
  it('Should minus two numbers', () => {
    expect(minus(4, 2)).toBe(2);
  });

  it('Should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});


