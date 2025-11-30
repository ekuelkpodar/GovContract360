import { Opportunity } from '@prisma/client';

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

async function callAI(prompt: string): Promise<string> {
  // Lightweight placeholder for OpenAI integration. In production, wire to OpenAI SDK.
  if (!process.env.OPENAI_API_KEY) {
    return `AI response (mocked) for prompt: ${prompt.substring(0, 120)}...`;
  }

  const body = {
    model,
    messages: [{ role: 'user', content: prompt }]
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`AI provider error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('AI call failed', error);
    return 'AI service unavailable; using fallback guidance.';
  }
}

export async function summarizeOpportunity(rawText: string, metadata: Record<string, string>) {
  const prompt = `Summarize the following government contracting opportunity with sections for scope, eligibility, key dates, and evaluation criteria.\nMetadata: ${JSON.stringify(
    metadata
  )}\nBody:${rawText}`;
  return callAI(prompt);
}

export async function generateProposalSections(
  opportunity: Opportunity,
  userNotes: string
): Promise<{ heading: string; content: string }[]> {
  const prompt = `Create a concise proposal outline for the opportunity titled "${opportunity.title}". Include 5 sections.
User notes: ${userNotes}`;
  const content = await callAI(prompt);
  return [
    { heading: 'Executive Summary', content },
    { heading: 'Technical Approach', content: 'Tailor your technical approach here based on AI guidance.' },
    { heading: 'Management Plan', content: 'Outline governance, staffing, and risk mitigation.' },
    { heading: 'Past Performance', content: 'Reference similar contracts and performance metrics.' },
    { heading: 'Pricing Strategy', content: 'Identify cost drivers and competitiveness notes.' }
  ];
}

export async function rewriteSearchQuery(query: string) {
  const prompt = `Rewrite the following plain-language search query so it better matches SAM.gov keyword search while preserving intent: ${query}`;
  return callAI(prompt);
}

export async function recommendBidDecision({
  opportunity,
  companyProfileSummary,
  riskScore,
  fitScore,
  context
}: {
  opportunity: Opportunity;
  companyProfileSummary: string;
  riskScore: number;
  fitScore: number;
  context?: string;
}) {
  const prompt = `You are a capture strategist. Given the opportunity below and the company profile, output a concise recommendation with one of: Strong Bid, Consider Carefully, Probably No-Bid. Include 3-5 bullet reasons.
Fit score: ${fitScore}
Risk score: ${riskScore}
Company profile: ${companyProfileSummary}
Opportunity: ${opportunity.title} for ${opportunity.agency} (${opportunity.noticeType}). Description: ${opportunity.description}
Additional context: ${context || 'none provided'}
Return JSON with fields { recommendation, reasoning }`;

  const content = await callAI(prompt);
  if (content.startsWith('{')) return JSON.parse(content);
  return { recommendation: 'Consider Carefully', reasoning: content };
}

export interface GapAnalysisResult {
  missingCapabilities: string[];
  missingCertifications: string[];
  suggestedRoles: string[];
  commentary: string;
}

export async function analyzeCapabilityGaps(opportunity: Opportunity, companyProfileSummary: string): Promise<GapAnalysisResult> {
  const prompt = `Compare the opportunity requirements to the company profile. List missing capabilities, certifications, and suggested teaming roles.`;
  const content = await callAI(`${prompt}\nProfile: ${companyProfileSummary}\nOpportunity: ${opportunity.title}\n${opportunity.description}`);
  return {
    missingCapabilities: ['Security clearance sponsor (stub)', 'NIST 800-171 evidence (stub)'],
    missingCertifications: ['ISO 27001 (example)'],
    suggestedRoles: ['Program Manager', 'Cyber SME', 'Compliance lead'],
    commentary: content
  };
}

export async function compareOpportunities(opportunities: Opportunity[], profileSummary: string) {
  const names = opportunities.map((o) => `${o.title} (${o.agency})`).join('\n');
  const prompt = `Compare the following opportunities for fit. Highlight better alignment and teaming ideas. Company profile: ${profileSummary}. Opportunities: ${names}`;
  return callAI(prompt);
}

export async function generateTasksForOpportunity(opportunity: Opportunity, context: string) {
  const prompt = `Generate a short list of 5 capture tasks for the opportunity ${opportunity.title}. Context: ${context}`;
  const content = await callAI(prompt);
  const lines = content.split(/\n|\r/).filter(Boolean).slice(0, 5);
  return lines.map((line, idx) => ({
    title: line.replace(/^[-*]/, '').trim() || `Task ${idx + 1}`,
    description: 'Auto-generated by AI assistant'
  }));
}
