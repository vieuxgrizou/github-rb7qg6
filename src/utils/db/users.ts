import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User } from '../../types/auth';

export async function getUser(uid: string) {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() as User : null;
}

export async function createUser(uid: string, userData: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

export async function updateUser(uid: string, userData: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: new Date().toISOString()
  });
}