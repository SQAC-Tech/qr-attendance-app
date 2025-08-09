'use client';
import React, { useEffect, useState } from 'react';
import { Platform, Text, View, StyleSheet, TouchableOpacity , Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAttendeeStore } from './store/attendeeStore';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import WebQRScanner from './webQRScanner';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const { attendees, fetchAttendees, markAttended } = useAttendeeStore();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'web' && !permission?.granted) requestPermission();
    fetchAttendees();
  }, []);

  const handleScannedData = async (data: string) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      const { regno, name, event_id } = parsed;

      if (!regno || !name || !event_id) throw new Error('Invalid QR');

      const matched = attendees.find(
        (a) =>
          a.regno.toLowerCase() === regno.toLowerCase() &&
          a.name.toLowerCase() === name.toLowerCase() &&
          a.event_id.toLowerCase() === event_id.toLowerCase()
      );

      if (!matched) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setStatusMessage('❌ Attendee not found');
        setStatusType('error');
      } else if (matched.marked) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setStatusMessage(`⚠️ Already marked: ${matched.name}`);
        setStatusType('error');
      } else {
        await markAttended(regno);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStatusMessage(`✅ Marked: ${matched.name}`);
        setStatusType('success');
      }
    } catch (error) {
      console.error(error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStatusMessage('❌ Invalid QR Code');
      setStatusType('error');
    }

    setTimeout(() => {
      setScanned(false);
      setStatusMessage('');
      setStatusType('');
    }, 2000);
  };

  const getBorderColor = () => {
    if (statusType === 'success') return '#28a745';
    if (statusType === 'error') return '#dc3545';
    return '#007AFF';
  };

  if (Platform.OS !== 'web' && !permission?.granted) {
    return <Text>No camera permission</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/sqac_logo.png')}
        style={{ width: 100, height: 100, marginBottom: 5 }}
      />
      <Text style={styles.title}>Scan QR Code</Text>
      <View style={[styles.cameraBox, { borderColor: getBorderColor() }]}>
        {Platform.OS === 'web' ? (
          <WebQRScanner onResult={handleScannedData} />
        ) : (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ data }) => handleScannedData(data)}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        )}

        {statusMessage !== '' && (
          <View
            style={[
              styles.feedbackOverlay,
              statusType === 'success' ? styles.success : styles.error,
            ]}
          >
            <Text style={styles.feedbackText}>{statusMessage}</Text>
          </View>
        )}
      </View>

      <Text style={styles.instruction}>Align QR code within the box</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00031cff',
  },
  cameraBox: {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  camera: {
    flex: 1,
  },
  instruction: {
    marginTop: 10,
    fontSize: 16,
    color: '#eee',
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: '40%',
    left: '5%',
    right: '5%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#28a745',
  },
  error: {
    backgroundColor: '#dc3545',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 16,
  },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center' ,fontStyle: 'normal', fontWeight: 'bold'},
});
