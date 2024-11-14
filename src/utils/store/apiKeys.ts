import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKeysState {
  keys: Record<string, string>;
  setApiKey: (provider: string, key: string) => void;
  getApiKey: (provider: string) => string | null;
  clearApiKey: (provider: string) => void;
}

export const useApiKeys = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      keys: {},
      setApiKey: (provider, key) => {
        set((state) => ({
          keys: {
            ...state.keys,
            [provider]: key
          }
        }));
      },
      getApiKey: (provider) => {
        return get().keys[provider] || null;
      },
      clearApiKey: (provider) => {
        set((state) => {
          const newKeys = { ...state.keys };
          delete newKeys[provider];
          return { keys: newKeys };
        });
      }
    }),
    {
      name: 'api-keys-storage',
      partialize: (state) => ({ keys: state.keys })
    }
  )
);