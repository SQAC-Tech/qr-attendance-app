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
  const { markAttended } = useAttendeeStore();
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      if (!parsed.regno || !parsed.name) throw new Error('Invalid QR');

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      markAttended(parsed.regno);
      setStatusMessage(`✅ Marked: ${parsed.regno}`);
      setStatusType('success');
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStatusMessage(`❌ Invalid QR`);
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

  return (
    <View style={styles.container}>
      <View style={styles.cameraBox}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        {statusMessage !== '' && (
          <View style={[styles.feedbackOverlay, statusType === 'success' ? styles.success : styles.error]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1F28',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  success: {
    backgroundColor: 'rgba(0, 180, 0, 0.7)',
  },
  error: {
    backgroundColor: 'rgba(180, 0, 0, 0.7)',
  },
  instruction: {
    color: '#fff',
    marginBottom: 30,
    fontSize: 16,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
