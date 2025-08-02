import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAttendeeStore } from './store/attendeeStore';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const { attendees, fetchAttendees, markAttended } = useAttendeeStore();
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
    fetchAttendees();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
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

  if (!permission?.granted) {
    return <Text>No camera permission</Text>;
  }

  const getBorderColor = () => {
    if (statusType === 'success') return '#28a745'; // green
    if (statusType === 'error') return '#dc3545'; // red
    return '#007AFF'; // blue (default)
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cameraBox, { borderColor: getBorderColor() }]}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
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
    backgroundColor: '#1E1F28',
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
});
