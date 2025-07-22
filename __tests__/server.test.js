import supertest from 'supertest';
import app from '../dashboard/server.js';

describe('GET /run', () => {
  it('should execute a command and return the output', async () => {
    const response = await supertest(app).get('/run?cmd=echo%20hello');
    expect(response.status).toBe(200);
    expect(response.text).toBe('hello\n');
  });
});