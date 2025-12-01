import { Opportunity } from '@prisma/client';

export const mockOpportunities: Opportunity[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `mock-${idx + 1}`,
  samId: null,
  externalId: null,
  title: idx % 4 === 0 ? `AI-Enabled Mission Platform ${idx + 1}` : `Cyber Defense & Cloud Modernization ${idx + 1}`,
  agency:
    idx % 3 === 0 ? 'Department of Defense' : idx % 3 === 1 ? 'General Services Administration' : 'Department of Homeland Security',
  department: idx % 3 === 0 ? 'Air Force' : idx % 3 === 1 ? 'FEDSIM' : 'CISA',
  solicitationNumber: `FA-${2000 + idx}`,
  noticeType: idx % 3 === 0 ? 'Solicitation' : idx % 3 === 1 ? 'Sources Sought' : 'RFI',
  naicsCodes: idx % 2 === 0 ? ['541512', '541611'] : ['541513', '541519'],
  pscCodes: idx % 2 === 0 ? ['D399'] : ['R408'],
  setAside: idx % 3 === 0 ? 'WOSB' : idx % 3 === 1 ? 'Small Business' : 'SDVOSB',
  placeOfPerformance: idx % 2 === 0 ? 'CONUS' : 'OCONUS',
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
