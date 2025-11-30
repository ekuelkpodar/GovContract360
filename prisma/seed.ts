import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { computeFitScore, computeRiskScore } from '../lib/scoring';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const organization = await prisma.organization.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Civic Cyber LLC'
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: 'founder@example.com' },
    update: {},
    create: {
      email: 'founder@example.com',
      name: 'Founder',
      passwordHash,
      role: 'OWNER',
      organizationId: organization.id,
      onboardingCompleted: true
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'bd@example.com' },
    update: {},
    create: {
      email: 'bd@example.com',
      name: 'Business Dev',
      passwordHash,
      role: 'ADMIN',
      organizationId: organization.id,
      onboardingCompleted: true
    }
  });

  const member = await prisma.user.upsert({
    where: { email: 'analyst@example.com' },
    update: {},
    create: {
      email: 'analyst@example.com',
      name: 'Capture Analyst',
      passwordHash,
      role: 'MEMBER',
      organizationId: organization.id
    }
  });

  await prisma.organization.update({ where: { id: organization.id }, data: { primaryContactUserId: owner.id } });

  await prisma.companyProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      organizationId: organization.id,
      userId: owner.id,
      companyName: 'Civic Cyber LLC',
      website: 'https://civic-cyber.example.com',
      size: '50-100',
      primaryNaics: '541512',
      primaryPsc: 'D399',
      capabilities: { focus: 'Cybersecurity & IT modernization' },
      keywords: ['cybersecurity', 'zero trust', 'cloud migration', 'security operations'],
      preferredAgencies: ['Department of Defense', 'Department of Homeland Security', 'Department of Veterans Affairs'],
      preferredSetAsides: ['Small Business'],
      preferredNoticeTypes: ['Solicitation', 'Sources Sought'],
      typicalValueMin: 250000,
      typicalValueMax: 5000000,
      baseLocation: 'Arlington, VA',
      maxDistanceMiles: 200
    }
  });

  const agencies = ['Department of Defense', 'Department of Homeland Security', 'Department of Veterans Affairs', 'GSA', 'NASA'];
  const departments = ['Army', 'Navy', 'AFWERX', 'FEMA', 'VA OIT'];
  const noticeTypes = ['Solicitation', 'Sources Sought', 'Award'];
  const setAsides = ['Small Business', '8(a)', 'SDVOSB', 'None'];
  const now = new Date();

  const opportunities = await Promise.all(
    Array.from({ length: 50 }).map((_, idx) => {
      const agency = agencies[idx % agencies.length];
      const department = departments[idx % departments.length];
      const noticeType = noticeTypes[idx % noticeTypes.length];
      const setAside = setAsides[idx % setAsides.length];
      const estimatedValueMax = 500000 + idx * 50000;
      const opportunity = {
        title: `Modernization Support ${idx + 1}`,
        agency,
        department,
        solicitationNumber: `SOL-${1000 + idx}`,
        noticeType,
        naicsCodes: idx % 2 === 0 ? ['541512'] : ['541611'],
        pscCodes: ['D305', 'D399'],
        setAside,
        placeOfPerformance: 'United States',
        estimatedValueMin: 150000,
        estimatedValueMax,
        responseDeadline: new Date(now.getTime() + (idx + 7) * 86400000),
        postedDate: new Date(now.getTime() - idx * 86400000),
        url: 'https://sam.gov',
        description:
          'Cybersecurity engineering, zero trust architecture implementation, and cloud migration support for federal stakeholders.',
        rawText: 'Long form acquisition description placeholder for AI summarization.',
        status: 'Open'
      };
      return prisma.opportunity.upsert({ where: { solicitationNumber: opportunity.solicitationNumber }, update: {}, create: opportunity });
    })
  );

  const savedSearch = await prisma.savedSearch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: owner.id,
      organizationId: organization.id,
      name: 'Cyber weekly',
      query: 'cybersecurity zero trust',
      filters: { agency: 'Department of Defense' },
      frequency: 'WEEKLY'
    }
  });

  await prisma.alertSubscription.upsert({
    where: { id: 1 },
    update: {},
    create: { userId: owner.id, savedSearchId: savedSearch.id, deliveryChannel: 'EMAIL', isActive: true }
  });

  const profile = await prisma.companyProfile.findFirst({ where: { organizationId: organization.id } });
  if (profile) {
    const firstTwo = opportunities.slice(0, 2);
    for (const opp of firstTwo) {
      const fitScore = computeFitScore(opp, profile);
      const riskScore = computeRiskScore(opp, profile);
      await prisma.savedOpportunity.upsert({
        where: { userId_opportunityId: { userId: owner.id, opportunityId: opp.id } },
        update: { fitScore, riskScore, organizationId: organization.id },
        create: {
          userId: owner.id,
          organizationId: organization.id,
          opportunityId: opp.id,
          status: 'Pursuing',
          priority: 'high',
          fitScore,
          riskScore
        }
      });
    }
  }

  await prisma.proposalDraft.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: owner.id,
      organizationId: organization.id,
      opportunityId: opportunities[0].id,
      title: 'Zero Trust Architecture Response',
      sections: [
        { heading: 'Executive Summary', content: 'We deliver secure modernization aligned to DoD reference designs.' },
        { heading: 'Technical Approach', content: 'Phased zero trust rollout with continuous ATO acceleration.' }
      ],
      status: 'Draft',
      templateName: 'Standard Zero Trust',
      version: 1
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        organizationId: organization.id,
        userId: owner.id,
        type: 'alert',
        payload: { message: '3 new opportunities found for Cyber weekly.' }
      },
      {
        organizationId: organization.id,
        userId: admin.id,
        type: 'proposal',
        payload: { message: 'Proposal draft updated: Zero Trust Architecture Response' }
      }
    ]
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
