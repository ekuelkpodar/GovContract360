// Abstractions for importing opportunities from multiple providers.
// These are intentionally framework-agnostic and can be wired to cron jobs or manual triggers.
import { Opportunity } from '@prisma/client';

export interface ExternalOpportunity {
  externalId: string;
  title: string;
  agency: string;
  description: string;
  responseDeadline: Date;
  postedDate: Date;
  naicsCodes?: string[];
  pscCodes?: string[];
  setAside?: string;
  noticeType?: string;
  url?: string;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
}

export interface ExternalOpportunitySource {
  listUpdatedSince(since: Date): Promise<ExternalOpportunity[]>;
  getById(externalId: string): Promise<ExternalOpportunity | null>;
  label: string;
}

export class SamGovSource implements ExternalOpportunitySource {
  label = 'SAM.gov (stub)';

  async listUpdatedSince(): Promise<ExternalOpportunity[]> {
    // Placeholder for real SAM.gov integration; returns empty list in demo mode.
    return [];
  }

  async getById(): Promise<ExternalOpportunity | null> {
    return null;
  }
}

export class ManualCSVSource implements ExternalOpportunitySource {
  label = 'CSV Upload';
  constructor(public rows: ExternalOpportunity[]) {}

  async listUpdatedSince(): Promise<ExternalOpportunity[]> {
    return this.rows;
  }

  async getById(externalId: string): Promise<ExternalOpportunity | null> {
    return this.rows.find((row) => row.externalId === externalId) ?? null;
  }
}

export const mapExternalToOpportunity = (external: ExternalOpportunity): Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    samId: null,
    externalId: external.externalId,
    title: external.title,
    agency: external.agency,
    department: null,
    solicitationNumber: external.externalId,
    noticeType: external.noticeType || 'Solicitation',
    naicsCodes: external.naicsCodes || [],
    pscCodes: external.pscCodes || [],
    setAside: external.setAside ?? null,
    placeOfPerformance: null,
    estimatedValueMin: external.estimatedValueMin ?? null,
    estimatedValueMax: external.estimatedValueMax ?? null,
    responseDeadline: external.responseDeadline,
    postedDate: external.postedDate,
    url: external.url || '',
    description: external.description,
    rawText: external.description,
    status: 'Open',
  };
};
