import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import type { WordPressSite } from '../types';

export const sitesCollection = collection(db, 'sites');

export async function getSites() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const q = query(sitesCollection, where('userId', '==', user.uid));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WordPressSite[];
}

export async function createSite(site: Omit<WordPressSite, 'id'>) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docRef = await addDoc(sitesCollection, {
    ...site,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return {
    id: docRef.id,
    ...site
  } as WordPressSite;
}

export async function updateSite(id: string, site: Partial<WordPressSite>) {
  const siteRef = doc(db, 'sites', id);
  await updateDoc(siteRef, {
    ...site,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteSite(id: string) {
  const siteRef = doc(db, 'sites', id);
  await deleteDoc(siteRef);
}