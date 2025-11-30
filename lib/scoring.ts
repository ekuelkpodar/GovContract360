import { CompanyProfile, Opportunity } from '@prisma/client';

function normalizeKeywords(values: string[] = []) {
  return values.map((v) => v.toLowerCase());
}

export function computeFitScore(opportunity: Opportunity, profile?: CompanyProfile | null): number {
  if (!profile) return 50;
  let score = 40;
  const profileKeywords = normalizeKeywords(profile.keywords || []);
  const oppText = `${opportunity.title} ${opportunity.description}`.toLowerCase();
  const keywordHits = profileKeywords.filter((kw) => oppText.includes(kw)).length;
  score += Math.min(30, keywordHits * 6);

  if (profile.primaryNaics && opportunity.naicsCodes.includes(profile.primaryNaics)) score += 10;
  if (profile.preferredAgencies?.includes(opportunity.agency)) score += 10;
  const min = profile.typicalValueMin || 0;
  const max = profile.typicalValueMax || 0;
  if (min && max && opportunity.estimatedValueMax) {
    if (opportunity.estimatedValueMax >= min && opportunity.estimatedValueMax <= max) score += 10;
  }
  return Math.min(100, Math.max(0, score));
}

export function computeRiskScore(opportunity: Opportunity, profile?: CompanyProfile | null): number {
  let score = 30;
  const daysToClose =
    (new Date(opportunity.responseDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  if (daysToClose < 7) score += 30;
  else if (daysToClose < 14) score += 15;

  const complexSignals = ['cybersecurity', 'compliance', 'classified', 'multi-phase'];
  const lowerText = opportunity.description.toLowerCase();
  score += complexSignals.filter((term) => lowerText.includes(term)).length * 5;

  if (profile?.preferredSetAsides && opportunity.setAside && !profile.preferredSetAsides.includes(opportunity.setAside)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}
