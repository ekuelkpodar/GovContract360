import { computeFitScore, computeRiskScore } from '../lib/scoring';
import { Opportunity, CompanyProfile } from '@prisma/client';

describe('scoring', () => {
  const opportunity = {
    id: '1',
    samId: null,
    externalId: null,
    title: 'Cybersecurity modernization',
    agency: 'Department of Defense',
    department: 'Army',
    solicitationNumber: 'SOL-1',
    noticeType: 'Solicitation',
    naicsCodes: ['541512'],
    pscCodes: ['D399'],
    setAside: 'Small Business',
    placeOfPerformance: 'VA',
    estimatedValueMin: 100000,
    estimatedValueMax: 750000,
    responseDeadline: new Date(),
    postedDate: new Date(),
    url: 'https://example.com',
    description: 'Zero trust cybersecurity overhaul including compliance and multi-phase rollout.',
    rawText: 'raw',
    status: 'Open',
    createdAt: new Date(),
    updatedAt: new Date()
  } as unknown as Opportunity;

  const profile = {
    id: 1,
    organizationId: 1,
    userId: 1,
    companyName: 'Test',
    website: null,
    size: null,
    primaryNaics: '541512',
    primaryPsc: 'D399',
    capabilities: {},
    keywords: ['cybersecurity', 'zero trust'],
    preferredAgencies: ['Department of Defense'],
    preferredSetAsides: ['Small Business'],
    preferredNoticeTypes: ['Solicitation'],
    typicalValueMin: 100000,
    typicalValueMax: 1000000,
    baseLocation: null,
    maxDistanceMiles: null,
    createdAt: new Date(),
    updatedAt: new Date()
  } as unknown as CompanyProfile;

  it('boosts fit when keywords and NAICS match', () => {
    const score = computeFitScore(opportunity, profile);
    expect(score).toBeGreaterThan(70);
  });

  it('raises risk for short timelines or complex work', () => {
    const score = computeRiskScore(opportunity, profile);
    expect(score).toBeGreaterThanOrEqual(30);
  });
});
