// store/attendeeStore.ts
import { create } from 'zustand';
import { databases } from '../lib/appwrite';

const DATABASE_ID = '688bbe51002e8b914a71';
const COLLECTION_ID = '688bc48f000adba743bb';

type Attendee = {
  name: string;
  regno: string;
  event_id: string;
  marked: boolean;
  $id?: string; // required to update document
};

type State = {
  attendees: Attendee[];
  setAttendees: (newAttendees: Attendee[]) => void;
  fetchAttendees: () => Promise<void>;
  markAttended: (regno: string) => Promise<void>;
};

export const useAttendeeStore = create<State>((set, get) => ({
  attendees: [],

  setAttendees: (newAttendees) => set({ attendees: newAttendees }),

  fetchAttendees: async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

      const attendees: Attendee[] = response.documents.map((doc: any) => ({
        name: doc.name,
        regno: doc.regno,
        event_id: doc.event_id,
        marked: doc.marked ?? false,
        $id: doc.$id,
      }));

      set({ attendees });
    } catch (err) {
      console.error('❌ Failed to fetch attendees:', err);
    }
  },

  markAttended: async (regno: string) => {
    const attendee = get().attendees.find((a) => a.regno === regno);
    if (!attendee || attendee.marked) return;

    try {
      // Update in Appwrite
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, attendee.$id!, {
        marked: true,
      });

      // Update local state
      set((state) => ({
        attendees: state.attendees.map((a) =>
          a.regno === regno ? { ...a, marked: true } : a
        ),
      }));
    } catch (err) {
      console.error(`❌ Failed to mark attendee ${regno} as attended:`, err);
    }
  },
}));
