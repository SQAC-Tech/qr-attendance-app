import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Button} from 'react-native';
import { databases, ID } from './lib/appwrite'; 
import { Link, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


const DATABASE_ID = '688bbe51002e8b914a71';
const COLLECTION_ID = '688bc48f000adba743bb';

const sampleData = [
  { name: "Jay Jariwala", regno: "RA2111003030001", event_id: "EVT01" },
  { name: "Arjun Singh", regno: "RA2111003030002", event_id: "EVT01" },
  { name: "Sneha Reddy", regno: "RA2111003030003", event_id: "EVT02" },
  { name: "Priya Sharma", regno: "RA2111003030004", event_id: "EVT02" },
  { name: "Nikhil Verma", regno: "RA2111003030005", event_id: "EVT03" }
];

export default function AddSample() {

    const router = useRouter();
    const navigation = useNavigation();
const addSampleAttendees = async () => {
  try {
    for (const attendee of sampleData) {
      console.log("Adding:", attendee); // ✅ Log each attendee

      const res = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        attendee
      );

      console.log("Inserted:", res); // ✅ Log successful insertion
    }

    alert("Sample attendees added!");
  } catch (error) {
    console.error("Error inserting attendees:", error); // ❌ If something breaks, you’ll see it here
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCAN QR CODE</Text>
      <Text style={styles.title}>This Page is yet to be made</Text>
      <Link href="/" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Back to Home</Text>
              </TouchableOpacity>
      </Link>
      
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1F28' },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  Button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
});
