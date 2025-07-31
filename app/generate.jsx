import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Link, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


export default function GenerateQR() {
  const [regno, setRegNo] = useState('');
  const [roll, setRoll] = useState('');
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const data = JSON.stringify({ regno, roll });



  return (
    <KeyboardAvoidingView
      style={styles.container}


      
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>🎯 Generate Your QR Code</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your registration number"
        placeholderTextColor="#888"
        value={regno}
        onChangeText={setRegNo}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Event roll number"
        placeholderTextColor="#888"
        value={roll}
        onChangeText={setRoll}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setShowQR(true);
        }}
        disabled={!regno || !roll}
      >
        <Text style={styles.buttonText}>Generate QR</Text>
      </TouchableOpacity>

      <Link href="/" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Back to Home</Text>
              </TouchableOpacity>
      </Link>

      

      {showQR && (
        <View style={styles.qrContainer}>
          <QRCode value={data} size={200} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1F28',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2c2f3a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginVertical: 10,
  },
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
    fontSize: 18,
    fontWeight: '600',
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});
