import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator , TouchableOpacity} from 'react-native';
import { databases } from './lib/appwrite'; // adjust path if needed
import { Link, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const DATABASE_ID = '688bbe51002e8b914a71';
const COLLECTION_ID = '688bc48f000adba743bb';

export default function AttendeesScreen() {

  const router = useRouter();
  const navigation = useNavigation();

  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setAttendees(res.documents);
    } catch (error) {
      console.error("Failed to fetch attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.details}>{item.name}</Text>
      <Text style={styles.details}>Reg No: {item.regno}</Text>
      <Text style={styles.details}>Event ID: {item.event_id}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 100 }} />;
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}></Text>
        <Text style={styles.title}>Attendees List</Text>
        <FlatList
          data={attendees}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
        />
        <Link href="/" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </Link>
      </View>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1E1F28' },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#2C2F38', padding: 15, borderRadius: 10, marginBottom: 10 },
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

