// app/attendance.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAttendance } from '../context/AttendanceContext';

export default function AttendanceList() {
  const { entries } = useAttendance();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance List</Text>
      <FlatList
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.name}>{item.regno}</Text>
            <Text style={styles.details}>Roll: {item.roll}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  entry: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  details: { fontSize: 14, color: '#333' },
});
