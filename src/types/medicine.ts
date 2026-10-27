export type MedicineCategory =
  | 'Analgesic'
  | 'Antibiotic'
  | 'Antihistamine'
  | 'Antipyretic'
  | 'Cardiovascular'
  | 'Gastrointestinal'
  | 'Respiratory'
  | 'Vitamin & Supplement'
  | 'Other';

export interface Medicine {
  /** Unique medicine record identifier */
  id: string;
  /** Primary medicine product or trade name */
  name: string;
  /** Active pharmaceutical generic chemical name */
  genericName: string;
  /** List of recognized commercial brand names */
  brandNames: string[];
  /** Therapeutic classification */
  category: MedicineCategory;
  /** Path to local or hosted packaging image (optional if unphotographed) */
  imagePath?: string;
  /** Alias for backward compatibility */
  imageUrl?: string;
  /** AR target tracking descriptor ID (optional if target not yet registered) */
  arTargetId?: string;
  /** Clinical indications and approved therapeutic uses */
  uses: string[];
  /** Backwards compatibility alias for uses */
  indications?: string[];
  /** Specific dosage instructions, intervals, and max limits */
  dosageInfo: string;
  /** Backwards compatibility alias for dosageInfo */
  dosageInstructions?: string;
  /** Pharmaceutical formulation form (e.g., Tablet, Capsule, Syrup) */
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Suspension' | 'Inhaler' | 'Drops' | 'Ointment';
  /** Unit strength per dose (e.g. 500 mg, 10 mg) */
  strength: string;
  /** Pharmaceutical manufacturer or distributor label */
  manufacturer: string;
  /** General description summary */
  description: string;
  /** Precautions, boxed warnings, and drug interactions */
  precautions: string[];
  /** Backwards compatibility alias for precautions */
  warnings?: string[];
  /** Documented adverse reactions and side effects */
  sideEffects: string[];
  /** Storage temperature, humidity, and handling directions */
  storageInstructions: string;
  /** Backwards compatibility alias for storageInstructions */
  storage?: string;
  /** Conditions or patient factors where medication must not be used */
  contraindications: string[];
  /** Public authoritative clinical sources referenced */
  informationSources: string[];
  /** Backwards compatibility alias for informationSources */
  sources?: string[];
  /** Date the monograph was clinically verified and reviewed */
  lastReviewedDate: string;
  /** Whether a prescription is required */
  requiresPrescription: boolean;
  /** Explicitly marks this record as an educational demonstration entry */
  isDemonstrationRecord: boolean;
}
