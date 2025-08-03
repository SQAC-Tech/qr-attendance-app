// lib/firebaseAuth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const signup = async (email: string, password: string, name: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await auth.signOut();
};