import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { logout } from './lib/appwrite';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch (err) {
      Alert.alert('Error', err.message || 'Logout failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={require('../assets/images/sqac_logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>SQAC QR Attendance</Text>

      <Link href="/generate" asChild>
        <TouchableOpacity style={styles.button1}>
          <Text style={styles.buttonText}>🎯 Generate QR Code</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/scan" asChild>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.buttonText}>📷 Scan QR (Admin)</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/attendance" asChild>
        <TouchableOpacity style={styles.button3}>
          <Text style={styles.buttonText}>📊 View Attendance</Text>
        </TouchableOpacity>
      </Link>

      
      <TouchableOpacity onPress={handleLogout} style={styles.button4}>
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1F28',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 50,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  button1: {
    backgroundColor: '#ffa600ff',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 18,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  button2: {
    backgroundColor: '#ff8c00ff',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 18,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  button3: {
    backgroundColor: '#ff6a00ff',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 18,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  button4: {
    backgroundColor: '#ff6200ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 18,
    marginVertical: 12,
    width: '40%',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  logout: {
    marginTop: 30,
    backgroundColor: '#444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
