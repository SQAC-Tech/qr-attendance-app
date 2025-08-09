import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Link, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


export default function GenerateQR() {
  const [name, setName] = useState('');
  const [regno, setRegNo] = useState('');
  const [event_id, setEventId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const data = JSON.stringify({ name ,regno, event_id });



  return (
    <KeyboardAvoidingView
      style={styles.container}


      
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image source={require('../assets/images/sqac_logo.png')} style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 20 }} resizeMode="contain" />
      
      <Text style={styles.title}>Generate Your QR Code</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your registration Number"
        placeholderTextColor="#888"
        value={regno}
        onChangeText={setRegNo}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Event Roll Number"
        placeholderTextColor="#888"
        value={event_id}
        onChangeText={setEventId}
        keyboardType="default"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setShowQR(true);
        }}
        disabled={!name || !regno || !event_id}
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
    backgroundColor: '#00031cff',
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
    backgroundColor: '#ff7b00ff',
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
