import type { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';
import { prisma } from '../../../lib/prisma';
import { ManualCSVSource, mapExternalToOpportunity } from '../../../lib/imports/opportunities';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { csv, organizationId = 1, createdByUserId = 1, sourceLabel = 'Legacy CSV' } = req.body;

  if (!csv) return res.status(400).json({ error: 'CSV payload required' });

  const parsed = Papa.parse(csv.trim(), { header: true });
  const rows = (parsed.data as any[]).filter(Boolean);
  const source = new ManualCSVSource(
    rows.slice(0, 100).map((row, idx) => ({
      externalId: row.solicitationNumber || row.id || `csv-${idx}`,
      title: row.title,
      agency: row.agency,
      description: row.description,
      responseDeadline: row.responseDeadline ? new Date(row.responseDeadline) : new Date(),
      postedDate: row.postedDate ? new Date(row.postedDate) : new Date(),
      naicsCodes: row.naics ? String(row.naics).split(',').map((s: string) => s.trim()) : [],
      pscCodes: row.psc ? String(row.psc).split(',').map((s: string) => s.trim()) : [],
      setAside: row.setAside,
      noticeType: row.noticeType,
      url: row.url,
      estimatedValueMin: row.valueMin ? Number(row.valueMin) : undefined,
      estimatedValueMax: row.valueMax ? Number(row.valueMax) : undefined
    }))
  );

  const batch = await prisma.importBatch.create({
    data: {
      organizationId: Number(organizationId),
      type: 'OPPORTUNITY_CSV',
      sourceLabel,
      createdByUserId: Number(createdByUserId),
      totalRecords: rows.length,
      successfulRecords: 0,
      failedRecords: 0
    }
  });

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    try {
      const mapped = mapExternalToOpportunity(source.rows[i]);
      await prisma.opportunity.create({ data: mapped });
      successful += 1;
    } catch (error: any) {
      failed += 1;
      await prisma.importError.create({
        data: {
          importBatchId: batch.id,
          rowNumber: i + 1,
          errorMessage: error.message || 'Unknown error',
          rawRowData: rows[i]
        }
      });
    }
  }

  const updated = await prisma.importBatch.update({
    where: { id: batch.id },
    data: { successfulRecords: successful, failedRecords: failed }
  });

  res.status(200).json({ batch: updated });
}
