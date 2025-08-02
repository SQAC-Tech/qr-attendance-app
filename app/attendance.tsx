import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { databases } from './lib/appwrite';
import { Link } from 'expo-router';
import { useAttendeeStore } from './store/attendeeStore';

const DATABASE_ID = '688bbe51002e8b914a71';
const COLLECTION_ID = '688bc48f000adba743bb';

type Attendee = {
  name: string;
  regno: string;
  event_id: string;
  marked: boolean;
};

export default function AttendeesScreen() {
  const attendees = useAttendeeStore((state) => state.attendees);
  const setAttendees = useAttendeeStore((state) => state.setAttendees);

  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      const fetchedAttendees: Attendee[] = res.documents.map((doc: any) => ({
        name: doc.name,
        regno: doc.regno,
        event_id: doc.event_id, // ensure this key matches exactly with Appwrite field
        marked: doc.marked ?? false, // fallback in case field missing
      }));
      setAttendees(fetchedAttendees);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const renderItem = ({ item }: { item: Attendee }) => (
    <View style={[styles.card, item.marked && styles.markedCard]}>
      <Text style={styles.details}>{item.name}</Text>
      <Text style={styles.details}>Reg No: {item.regno}</Text>
      <Text style={styles.details}>Event ID: {item.event_id}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 100 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Text style={styles.title}>Attendees List</Text>
      <FlatList
        data={attendees}
        extraData={attendees}
        keyExtractor={(item) => item.regno}
        renderItem={renderItem}
      />
      <Link href="/" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1E1F28' },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#2C2F38',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  markedCard: {
    backgroundColor: '#28a745', // Green for marked attendees
  },
  details: { color: '#ccc', fontSize: 16, marginTop: 4 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 16,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
