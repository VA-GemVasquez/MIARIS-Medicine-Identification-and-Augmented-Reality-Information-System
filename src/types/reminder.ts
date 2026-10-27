export type ReminderStatus = 'pending' | 'taken' | 'skipped';

export interface MedicineReminder {
  /** Unique reminder schedule identifier */
  id: string;
  /** Linked medicine monograph ID (optional if manual entry) */
  medicineId?: string;
  /** Medicine name and strength */
  medicineName: string;
  /** Prescribed dose quantity (e.g. 1 tablet, 500mg, 10ml) */
  dosage: string;
  /** Scheduled clock time (e.g. "08:00 AM") */
  scheduledTime: string;
  /** Alias for backward compatibility with existing views */
  time?: string;
  /** Descriptive repeat interval (e.g. "Once daily", "Every 8 hours", "As needed") */
  repeatSchedule: string;
  /** Formatted frequency description */
  frequency?: 'Once daily' | 'Twice daily' | 'Three times daily' | 'Every 8 hours' | 'As needed';
  /** Days of week on which reminder repeats */
  daysOfWeek: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  /** Special instructions or timing rules (e.g. "Take with food") */
  instructions: string;
  /** Whether the reminder is active and enabled */
  isEnabled: boolean;
  /** Intake tracking state for current day */
  status: ReminderStatus;
  /** Timestamp when dose was recorded as taken */
  lastTaken?: string;
}
