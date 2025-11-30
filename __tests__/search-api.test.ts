import handler from '../pages/api/opportunities/search';
import { createMocks } from 'node-mocks-http';

describe('opportunities search API', () => {
  it('returns data array', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { q: 'cyber' }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(Array.isArray(body.data)).toBe(true);
  });
});
