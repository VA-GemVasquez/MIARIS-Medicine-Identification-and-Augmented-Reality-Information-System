import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bell,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  X,
  Pill,
  Power,
  AlertTriangle,
  BellOff,
  Info,
} from 'lucide-react';
import { medicines } from '../data/medicines';
import type { MedicineReminder } from '../types/reminder';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type DayOfWeek = typeof DAYS_OF_WEEK[number];

/* ─── Field validation ─────────────────────────────────────────────────── */
interface FormErrors {
  dosage?: string;
  scheduledTime?: string;
}

function validateTime(value: string): boolean {
  // Accept HH:MM, H:MM AM/PM, or 24-hour formats
  return /^([01]?\d|2[0-3]):[0-5]\d(\s?(AM|PM|am|pm))?$/.test(value.trim());
}

function validateForm(dosage: string, scheduledTime: string): FormErrors {
  const errors: FormErrors = {};
  if (!dosage.trim()) errors.dosage = 'Dosage amount is required.';
  if (!scheduledTime.trim()) {
    errors.scheduledTime = 'Scheduled time is required.';
  } else if (!validateTime(scheduledTime)) {
    errors.scheduledTime = 'Enter a valid time (e.g. 08:00 AM or 14:30).';
  }
  return errors;
}

/* ─── Toast notification ───────────────────────────────────────────────── */
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => (
  <div
    role="status"
    aria-live="polite"
    className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white max-w-sm w-[calc(100%-2rem)] ${
      type === 'success' ? 'bg-[#0D9488]' : 'bg-[#DC2626]'
    }`}
  >
    {type === 'success'
      ? <CheckCircle2 className="w-4 h-4 shrink-0" />
      : <AlertTriangle className="w-4 h-4 shrink-0" />}
    <span className="flex-1">{message}</span>
    <button
      onClick={onDismiss}
      className="ml-1 opacity-70 hover:opacity-100"
      aria-label="Dismiss notification"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

/* ─── Browser Notification helpers ────────────────────────────────────── */
function notificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationSupported()) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

/* ─── Main component ───────────────────────────────────────────────────── */
export const Reminders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedMedId = searchParams.get('medId');

  const { reminders, addReminder, deleteReminder, toggleReminderStatus, toggleReminderEnabled } =
    useAppStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'taken'>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(Boolean(preselectedMedId));

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notification permission state
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    notificationSupported() ? Notification.permission : 'denied'
  );
  const [showNotifBanner, setShowNotifBanner] = useState<boolean>(
    notificationSupported() && Notification.permission === 'default'
  );

  // Form fields
  const [selectedMedId, setSelectedMedId] = useState<string>(
    preselectedMedId || medicines[0]?.id || ''
  );
  const [dosage, setDosage] = useState<string>('1 tablet');
  const [scheduledTime, setScheduledTime] = useState<string>('08:00 AM');
  const [repeatSchedule, setRepeatSchedule] = useState<string>('Once daily');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
  ]);
  const [instructions, setInstructions] = useState<string>('Take with water after meal');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.length > 1 ? prev.filter((d) => d !== day) : prev
        : [...prev, day]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this reminder schedule? This action cannot be undone.')) {
      deleteReminder(id);
      showToast('Reminder deleted.', 'success');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(dosage, scheduledTime);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please fix the highlighted fields before saving.', 'error');
      return;
    }
    setFormErrors({});

    const med = medicines.find((m) => m.id === selectedMedId);
    if (!med) {
      showToast('Selected medicine not found. Please choose a valid entry.', 'error');
      return;
    }

    addReminder({
      medicineId: med.id,
      medicineName: `${med.name} ${med.strength}`,
      dosage: dosage.trim(),
      scheduledTime: scheduledTime.trim(),
      time: scheduledTime.trim(),
      repeatSchedule,
      frequency: repeatSchedule as MedicineReminder['frequency'],
      daysOfWeek: selectedDays,
      instructions: instructions.trim() || 'No special instructions',
      isEnabled: true,
      status: 'pending',
    });

    setShowAddForm(false);
    // Reset form
    setDosage('1 tablet');
    setScheduledTime('08:00 AM');
    setRepeatSchedule('Once daily');
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    setInstructions('Take with water after meal');
    showToast(`Reminder set for ${med.name} ${med.strength}.`, 'success');
  };

  const handleRequestNotification = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    setShowNotifBanner(false);
    if (perm === 'granted') {
      showToast('Browser notifications enabled. Note: notifications only fire while this page is open.', 'success');
    } else {
      showToast('Notification permission denied. You can change this in browser site settings.', 'error');
    }
  };

  const takenCount = reminders.filter((r) => r.status === 'taken').length;
  const progressPercent =
    reminders.length > 0 ? Math.round((takenCount / reminders.length) * 100) : 0;

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'taken') return r.status === 'taken';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold border border-blue-200 mb-1">
            <Bell className="w-3 h-3" aria-hidden="true" />
            Adherence Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dosage Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Set schedules, track intake, and manage medication alerts
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddForm(true)}
          aria-label="Add a new medication reminder"
          className="self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Reminder</span>
        </Button>
      </div>

      {/* Browser Notification Permission Banner */}
      {showNotifBanner && (
        <div
          role="region"
          aria-label="Browser notification permission"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl"
        >
          <Bell className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-slate-900">Enable browser notifications?</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browser notifications are supported but have{' '}
              <strong>important limitations</strong>: they only fire while this browser tab
              is open and the page is active. They are <strong>not</strong> a replacement
              for dedicated alarm apps or pharmacist counselling. Reminder schedules are
              saved locally and persist across page reloads.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleRequestNotification}
              className="px-3 py-1.5 text-xs font-bold bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Enable
            </button>
            <button
              onClick={() => setShowNotifBanner(false)}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Dismiss notification permission banner"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Notification status indicator (after decision) */}
      {!showNotifBanner && notifPermission === 'denied' && notificationSupported() && (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
          <BellOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Browser notifications are blocked. Enable them in browser site settings for in-tab alerts.
        </div>
      )}

      {/* Notification limitations info (always visible after granting) */}
      {notifPermission === 'granted' && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Notifications active (tab must stay open).</strong> These are browser-only
            reminders — they will not fire if the browser is closed or the device is locked.
            For reliable alarms, use your phone's built-in calendar or alarm app.
          </span>
        </div>
      )}

      {/* Adherence Progress Card */}
      <div
        role="region"
        aria-label="Today's medication adherence progress"
        className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold"
              aria-hidden="true"
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today's Medication Adherence</h2>
              <p className="text-xs text-slate-500">
                {takenCount} of {reminders.length} doses logged as taken
              </p>
            </div>
          </div>
          <span
            className="text-xl font-black text-[#2563EB]"
            aria-label={`${progressPercent} percent complete`}
          >
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Adherence progress"
        >
          <div
            className="bg-gradient-to-r from-[#2563EB] to-[#0D9488] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 italic">
          Adherence tracking resets when you mark a dose as taken or pending. Data is stored
          locally in your browser and not transmitted anywhere.
        </p>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <section
          aria-label="Add medication reminder form"
          className="bg-white rounded-2xl border-2 border-[#2563EB] p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900" id="add-form-title">
                Schedule Medication Reminder
              </h3>
            </div>
            <button
              onClick={() => { setShowAddForm(false); setFormErrors({}); }}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              aria-label="Close add reminder form"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <form
            onSubmit={handleAddSubmit}
            className="space-y-4 text-xs"
            aria-labelledby="add-form-title"
            noValidate
          >
            {/* Medicine Selector */}
            <div>
              <label htmlFor="med-select" className="block font-bold text-slate-700 mb-1">
                Select Medicine <span className="text-[#DC2626]" aria-hidden="true">*</span>
              </label>
              <select
                id="med-select"
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.strength}) — {m.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Dosage & Scheduled Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dosage-input" className="block font-bold text-slate-700 mb-1">
                  Dosage Amount <span className="text-[#DC2626]" aria-hidden="true">*</span>
                </label>
                <input
                  id="dosage-input"
                  type="text"
                  value={dosage}
                  onChange={(e) => { setDosage(e.target.value); if (formErrors.dosage) setFormErrors((p) => ({ ...p, dosage: undefined })); }}
                  placeholder="e.g. 1 tablet, 500mg, 10ml"
                  required
                  aria-describedby={formErrors.dosage ? 'dosage-error' : undefined}
                  aria-invalid={Boolean(formErrors.dosage)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${formErrors.dosage ? 'border-[#DC2626]' : 'border-slate-200'}`}
                />
                {formErrors.dosage && (
                  <p id="dosage-error" role="alert" className="mt-1 text-[#DC2626] font-semibold">
                    {formErrors.dosage}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="time-input" className="block font-bold text-slate-700 mb-1">
                  Scheduled Time <span className="text-[#DC2626]" aria-hidden="true">*</span>
                </label>
                <input
                  id="time-input"
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => { setScheduledTime(e.target.value); if (formErrors.scheduledTime) setFormErrors((p) => ({ ...p, scheduledTime: undefined })); }}
                  placeholder="e.g. 08:00 AM or 14:30"
                  required
                  aria-describedby="time-hint time-error"
                  aria-invalid={Boolean(formErrors.scheduledTime)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${formErrors.scheduledTime ? 'border-[#DC2626]' : 'border-slate-200'}`}
                />
                <p id="time-hint" className="mt-0.5 text-slate-400 text-[10px]">Format: 08:00 AM or 14:30</p>
                {formErrors.scheduledTime && (
                  <p id="time-error" role="alert" className="mt-1 text-[#DC2626] font-semibold">
                    {formErrors.scheduledTime}
                  </p>
                )}
              </div>
            </div>

            {/* Repeat Schedule */}
            <div>
              <label htmlFor="repeat-select" className="block font-bold text-slate-700 mb-1">
                Repeat Schedule
              </label>
              <select
                id="repeat-select"
                value={repeatSchedule}
                onChange={(e) => setRepeatSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="As needed">As needed (PRN)</option>
              </select>
            </div>

            {/* Repeat on Days */}
            <fieldset>
              <legend className="block font-bold text-slate-700 mb-1.5 text-xs">
                Repeat on Days
              </legend>
              <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Days of week">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      aria-pressed={isSelected}
                      className={`px-2.5 py-1.5 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Special Instructions */}
            <div>
              <label htmlFor="instructions-input" className="block font-bold text-slate-700 mb-1">
                Special Instructions
              </label>
              <input
                id="instructions-input"
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take with food, Avoid grapefruit"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Notification note */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Reminder limitation:</strong> This application stores reminders in your
                browser's local storage only. Browser-based alerts require this page to remain
                open. For reliable medication reminders, also set an alarm on your phone or
                consult a pharmacist about compliance aids.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-1">
              <Button type="submit" variant="primary" size="md" className="flex-1">
                Save Reminder
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => { setShowAddForm(false); setFormErrors({}); }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2" role="tablist" aria-label="Filter reminders">
        {(['all', 'pending', 'taken'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={filter === tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
              filter === tab
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? `All (${reminders.length})` : tab === 'pending' ? `Pending (${reminders.filter(r => r.status === 'pending').length})` : `Taken (${reminders.filter(r => r.status === 'taken').length})`}
          </button>
        ))}
      </div>

      {/* Reminder List */}
      <div className="space-y-3" role="list" aria-label="Medication reminders">
        {filteredReminders.length > 0 ? (
          filteredReminders.map((reminder) => {
            const isTaken = reminder.status === 'taken';
            const isEnabled = reminder.isEnabled !== false;

            return (
              <article
                key={reminder.id}
                role="listitem"
                aria-label={`Reminder: ${reminder.medicineName}`}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all ${
                  isTaken
                    ? 'border-slate-100 opacity-70'
                    : isEnabled
                    ? 'border-slate-200'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Left: Check + Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleReminderStatus(reminder.id)}
                      aria-label={isTaken ? `Mark ${reminder.medicineName} as pending` : `Mark ${reminder.medicineName} as taken`}
                      aria-pressed={isTaken}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all mt-0.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        isTaken
                          ? 'bg-[#0D9488] text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-[#2563EB] text-transparent hover:text-[#2563EB]'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm sm:text-base font-bold ${
                            isTaken ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {reminder.medicineName}
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {reminder.dosage}
                        </span>
                        {!isEnabled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                            Paused
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {reminder.instructions} · {reminder.repeatSchedule || reminder.frequency}
                      </p>

                      <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400 font-medium">
                        <span>Days:</span>
                        <span className="text-slate-600 font-semibold">
                          {reminder.daysOfWeek.join(', ')}
                        </span>
                      </div>

                      {reminder.lastTaken && (
                        <p className="text-[11px] font-semibold text-[#0D9488] mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Logged: {reminder.lastTaken}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Enable/Pause Toggle */}
                    <button
                      onClick={() => toggleReminderEnabled(reminder.id)}
                      aria-label={isEnabled ? `Pause ${reminder.medicineName} reminder` : `Activate ${reminder.medicineName} reminder`}
                      aria-pressed={isEnabled}
                      className={`p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        isEnabled
                          ? 'text-[#0D9488] hover:bg-teal-50'
                          : 'text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Power className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563EB] text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{reminder.scheduledTime || reminder.time}</span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      aria-label={`Delete ${reminder.medicineName} reminder`}
                      className="p-2 text-slate-400 hover:text-[#DC2626] rounded-xl hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          /* Empty State */
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div
              className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400"
              aria-hidden="true"
            >
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {filter === 'all' ? 'No reminders yet' : `No ${filter} reminders`}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filter === 'all'
                ? 'Add your prescribed or daily over-the-counter medications to track your schedule.'
                : `No reminders are currently marked as "${filter}".`}
            </p>
            {filter === 'all' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create First Reminder
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
