import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles successful login', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const success = await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
      
      expect(success).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  it('handles failed login', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const success = await result.current.login({
        email: 'wrong@example.com',
        password: 'wrongpass'
      });
      
      expect(success).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  it('handles logout', async () => {
    const { result } = renderHook(() => useAuth());
    
    // D'abord connecté
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });
    
    // Puis déconnexion
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('updates user profile', async () => {
    const { result } = renderHook(() => useAuth());
    
    // D'abord connecté
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });
    
    // Mise à jour du profil
    act(() => {
      result.current.updateUser({
        name: 'New Name'
      });
    });
    
    expect(result.current.user?.name).toBe('New Name');
  });
});