import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MedicineReminder } from '../types/reminder';
import { initialReminders } from '../data/mockReminders';

export type ScanStatus = 'idle' | 'scanning' | 'error' | 'stopped';

interface AppStoreState {
  // 1. Selected Medicine
  selectedMedicineId: string | null;
  setSelectedMedicineId: (id: string | null) => void;

  // 2. Scan Status
  scanStatus: ScanStatus;
  setScanStatus: (status: ScanStatus) => void;

  // 3. Recently Viewed Medicines (stores non-sensitive IDs)
  recentlyViewedIds: string[];
  addRecentlyViewedId: (id: string) => void;
  clearRecentlyViewed: () => void;

  // 4. Reminder State
  reminders: MedicineReminder[];
  addReminder: (reminder: Omit<MedicineReminder, 'id'>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderStatus: (id: string) => void;
  toggleReminderEnabled: (id: string) => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      // Selected Medicine
      selectedMedicineId: null,
      setSelectedMedicineId: (id) => set({ selectedMedicineId: id }),

      // Scan Status (in-memory, reset to idle)
      scanStatus: 'idle',
      setScanStatus: (status) => set({ scanStatus: status }),

      // Recently Viewed Medicines (default to demo records)
      recentlyViewedIds: ['med-001', 'med-002', 'med-003'],
      addRecentlyViewedId: (id) =>
        set((state) => {
          const filtered = state.recentlyViewedIds.filter((item) => item !== id);
          return { recentlyViewedIds: [id, ...filtered].slice(0, 6) };
        }),
      clearRecentlyViewed: () => set({ recentlyViewedIds: [] }),

      // Reminders State
      reminders: initialReminders,
      addReminder: (newReminderData) =>
        set((state) => {
          const newReminder: MedicineReminder = {
            ...newReminderData,
            id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            isEnabled: newReminderData.isEnabled ?? true,
            status: newReminderData.status ?? 'pending',
          };
          return { reminders: [newReminder, ...state.reminders] };
        }),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      toggleReminderStatus: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) => {
            if (r.id === id) {
              const isTaken = r.status === 'taken';
              return {
                ...r,
                status: isTaken ? 'pending' : 'taken',
                lastTaken: isTaken
                  ? undefined
                  : `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              };
            }
            return r;
          }),
        })),
      toggleReminderEnabled: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, isEnabled: !r.isEnabled } : r
          ),
        })),
    }),
    {
      name: 'miaris_app_state',
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive demonstration preferences & IDs
      partialize: (state) => ({
        selectedMedicineId: state.selectedMedicineId,
        recentlyViewedIds: state.recentlyViewedIds,
        reminders: state.reminders,
      }),
    }
  )
);
