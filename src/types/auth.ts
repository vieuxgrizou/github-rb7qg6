export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  darkMode: boolean;
  subscription: UserSubscription;
}

export interface UserSubscription {
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}