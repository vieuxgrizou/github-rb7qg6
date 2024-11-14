import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';

interface AuthState {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await signInWithEmailAndPassword(auth, email, password);
          set({ user });
          toast.success('Connexion réussie');
          return true;
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Échec de la connexion');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(user, { displayName: name });
          set({ user });
          toast.success('Inscription réussie');
          return true;
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Échec de l\'inscription');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null });
          toast.success('Déconnexion réussie');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Échec de la déconnexion');
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Écouteur d'état d'authentification
onAuthStateChanged(auth, (user) => {
  useAuth.setState({ user, isLoading: false });
});