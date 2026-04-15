import type { Supplier } from './entities/supplier.entity';
import type { SupplierBranchSeed } from './supplier-detail.extensions';

/** Филиалы поставщика из колонки `branches_json` (заполняется сидом). */
export function supplierBranchesFromDb(s: Supplier): SupplierBranchSeed[] {
  const raw = s.branchesJson;
  if (!Array.isArray(raw) || raw.length === 0) {
    return [];
  }
  return raw as SupplierBranchSeed[];
}
