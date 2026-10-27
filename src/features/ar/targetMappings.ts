/**
 * MIARIS AR Target Mapping
 *
 * Maps MindAR target indices (their position in the .mind compiled target file)
 * to medicine IDs in src/data/medicines.ts.
 *
 * MindAR assigns targets numeric indices based on the ORDER images are passed to
 * the compiler. Index 0 = first image, Index 1 = second image, etc.
 *
 * Update this map whenever you compile a new targets.mind file.
 */
export interface ARTargetMapping {
  /** Zero-based index in the compiled .mind file */
  targetIndex: number;
  /** Medicine ID from src/data/medicines.ts */
  medicineId: string;
  /** Human-readable label for debugging */
  label: string;
}

export const AR_TARGET_MAPPINGS: ARTargetMapping[] = [
  {
    targetIndex: 0,
    medicineId: 'med-001',
    label: 'Paracetamol 500mg (Biogesic)',
  },
  {
    targetIndex: 1,
    medicineId: 'med-002',
    label: 'Amoxicillin 500mg',
  },
  {
    targetIndex: 2,
    medicineId: 'med-003',
    label: 'Ibuprofen 400mg (Advil)',
  },
  {
    targetIndex: 3,
    medicineId: 'med-004',
    label: 'Cetirizine 10mg (Zyrtec)',
  },
  {
    targetIndex: 4,
    medicineId: 'med-005',
    label: 'Omeprazole 20mg (Prilosec)',
  },
  {
    targetIndex: 5,
    medicineId: 'med-006',
    label: 'Metformin 500mg (Glucophage)',
  },
];

/**
 * Lookup a medicine ID by target index.
 * Returns null if index is not registered.
 */
export function getMedicineIdByTargetIndex(index: number): string | null {
  const mapping = AR_TARGET_MAPPINGS.find((m) => m.targetIndex === index);
  return mapping ? mapping.medicineId : null;
}

