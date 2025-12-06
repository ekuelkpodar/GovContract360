jest.mock('../lib/prisma', () => ({
  prisma: {
    opportunity: {
      findMany: jest.fn()
    }
  }
}));

import { createMocks } from 'node-mocks-http';
import { mockOpportunities } from '../data/mockOpportunities';
import handler from '../pages/api/opportunities/search';
import { prisma } from '../lib/prisma';

const mockedFindMany = prisma.opportunity.findMany as jest.Mock;

describe('opportunities search API', () => {
  beforeEach(() => {
    mockedFindMany.mockReset();
  });

  it('returns data array', async () => {
    mockedFindMany.mockResolvedValue(mockOpportunities);
    const { req, res } = createMocks({
      method: 'GET',
      query: { q: 'cyber' }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('searches description text when Prisma is unavailable', async () => {
    mockedFindMany.mockRejectedValue(new Error('Unavailable'));

    const { req, res } = createMocks({
      method: 'GET',
      query: { q: 'analytics' }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const { data } = JSON.parse(res._getData());
    expect(data.length).toBe(mockOpportunities.length);
  });
});
