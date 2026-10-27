// Reminders feature exports and interfaces
export interface NotificationSchedule {
  reminderId: string;
  scheduledTime: Date;
  status: 'scheduled' | 'sent' | 'dismissed';
}

