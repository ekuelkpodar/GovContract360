import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // create sample users
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await prisma.user.createMany({
    data: [
      { email: 'founder@example.com', name: 'Founder', passwordHash, role: 'admin' },
      { email: 'bd@example.com', name: 'Business Dev', passwordHash, role: 'user' }
    ],
    skipDuplicates: true
  });

  console.log(`Seeded ${users.count} users`);

  // create sample opportunities
  const now = new Date();
  const opportunities = Array.from({ length: 40 }).map((_, idx) => ({
    title: `Mission Support Services #${idx + 1}`,
    agency: idx % 2 === 0 ? 'Department of Defense' : 'Department of Homeland Security',
    department: idx % 2 === 0 ? 'Army' : 'FEMA',
    solicitationNumber: `SOL-${1000 + idx}`,
    noticeType: idx % 3 === 0 ? 'Solicitation' : 'Sources Sought',
    naicsCodes: ['541512', '541611'],
    pscCodes: ['D399'],
    setAside: idx % 2 === 0 ? 'Small Business' : 'None',
    placeOfPerformance: 'United States',
    estimatedValueMin: 500000 + idx * 10000,
    estimatedValueMax: 2000000 + idx * 20000,
    responseDeadline: new Date(now.getTime() + (idx + 5) * 86400000),
    postedDate: new Date(now.getTime() - idx * 86400000),
    url: 'https://sam.gov',
    description: 'Comprehensive mission support services including IT modernization, cybersecurity, and logistics support.',
    rawText: 'Full request for proposals content would be stored here for AI summarization.',
    status: 'Open'
  }));

  for (const opportunity of opportunities) {
    await prisma.opportunity.create({ data: opportunity });
  }

  console.log(`Seeded ${opportunities.length} opportunities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
