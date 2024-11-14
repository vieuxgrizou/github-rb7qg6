import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../auth/useAuth';

describe('Auth Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });

      expect(success).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('test@example.com');
    });
  });

  it('persists user session', async () => {
    const { result, rerender } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    // Simule un rechargement
    rerender();

    expect(result.current.user).toBeDefined();
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('handles session check correctly', async () => {
    const { result } = renderHook(() => useAuth());

    // Sans utilisateur connecté
    await act(async () => {
      const isValid = await result.current.checkSession();
      expect(isValid).toBe(false);
    });

    // Avec utilisateur connecté
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    await act(async () => {
      const isValid = await result.current.checkSession();
      expect(isValid).toBe(true);
    });
  });

  it('clears session on logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      const isValid = await result.current.checkSession();
      expect(isValid).toBe(false);
    });
  });
});