// Scanner feature exports and interfaces
export interface ScanResult {
  rawText?: string;
  detectedMedicineId?: string;
  confidence: number;
  timestamp: number;
}

