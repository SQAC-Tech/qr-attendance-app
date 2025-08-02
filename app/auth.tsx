import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { account, login, signup } from './lib/appwrite';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
        await login(email, password);
      }

      router.replace('/');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Image
          source={require('../assets/images/sqac_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

        {!isLogin && (
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
        )}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAuth} style={styles.button}>
          {isLogin ? 'Login' : 'Register'}
        </Button>

        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          labelStyle={styles.buttonText}
        >
          {isLogin ? 'No account? Sign Up' : 'Already have an account? Sign In'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1F28',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#ffa600ff',
  },
  buttonText: {
    color: '#ffa600ff',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
