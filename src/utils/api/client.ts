import { auth } from '../../config/firebase';

export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user.getIdToken();
}