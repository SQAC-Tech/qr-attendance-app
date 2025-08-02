import { create } from 'zustand';

export type Attendee = {
  name: string;
  regno: string;
  event_id: string;
  marked?: boolean;
};

type Store = {
  attendees: Attendee[];
  setAttendees: (list: Attendee[]) => void;
  markAttended: (regno: string) => void;
};

export const useAttendeeStore = create<Store>((set) => ({
  attendees: [],
  setAttendees: (list) => set({ attendees: list }),
  markAttended: (regno) =>
    set((state) => ({
      attendees: state.attendees.map((attendee) =>
        attendee.regno === regno ? { ...attendee, marked: true } : attendee
      ),
    })),
}));
