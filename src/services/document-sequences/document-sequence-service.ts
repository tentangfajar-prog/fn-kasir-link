import type { Domain, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SequenceDb = typeof prisma | Prisma.TransactionClient;

export class DocumentSequenceService {
  constructor(private readonly db: SequenceDb = prisma) {}

  async nextNumber(domain: Domain, code: string, prefix: string) {
    const sequence = await this.db.documentSequence.upsert({
      where: { domain_code: { domain, code } },
      update: { currentNo: { increment: 1 } },
      create: { domain, code, prefix, currentNo: 1 },
    });

    return `${sequence.prefix}${String(sequence.currentNo).padStart(6, "0")}`;
  }
}

export const documentSequenceService = new DocumentSequenceService();
