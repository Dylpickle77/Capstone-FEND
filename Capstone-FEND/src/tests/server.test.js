const app = require('../server/server');

describe('Endpoint test', () => {
  it('/test', async (done) => {
    const response = await request.get('/test');
    expect(response.status).toBe(200);
    done();
  });
});