import { PassportData } from "../types/passport";

/**
 * PHASE 2 SEAM – services depend only on this interface.
 * Swap the Noop class for a Prisma one, e.g.
 *   class PrismaPassportRepository implements PassportRepository {
 *     save(d) { return prisma.passport.create({ data: d }); }
 *   }
 */
export interface PassportRepository {
  save(data: PassportData): Promise<PassportData & { id?: string }>;
}

export class NoopPassportRepository implements PassportRepository {
  async save(data: PassportData) { return data; } // Phase 1: nothing is persisted
}

export const passportRepository: PassportRepository = new NoopPassportRepository();
