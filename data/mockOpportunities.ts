import { Opportunity } from '@prisma/client';

export const mockOpportunities: Opportunity[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `mock-${idx + 1}`,
  samId: null,
  externalId: null,
  title: `AI-Enabled Mission Platform ${idx + 1}`,
  agency: idx % 2 === 0 ? 'Department of Defense' : 'General Services Administration',
  department: idx % 2 === 0 ? 'Air Force' : 'FEDSIM',
  solicitationNumber: `FA-${2000 + idx}`,
  noticeType: idx % 3 === 0 ? 'Solicitation' : 'Sources Sought',
  naicsCodes: ['541512', '541611'],
  pscCodes: ['D399'],
  setAside: idx % 2 === 0 ? 'WOSB' : 'Small Business',
  placeOfPerformance: 'CONUS',
  estimatedValueMin: 500000 + idx * 50000,
  estimatedValueMax: 2500000 + idx * 100000,
  responseDeadline: new Date(Date.now() + (idx + 7) * 86400000),
  postedDate: new Date(Date.now() - (idx + 2) * 86400000),
  url: 'https://sam.gov/mock',
  description:
    'AI-enabled analytics, cybersecurity, cloud migration, and managed services to support federal missions. Deliverables include roadmap, implementation, and sustainment.',
  rawText: 'Full solicitation text for mock data. Replace with SAM.gov payloads when available.',
  status: 'Open',
  createdAt: new Date(),
  updatedAt: new Date()
}));
