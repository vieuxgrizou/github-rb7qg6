import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sites from '../../pages/Sites';
import { useAuth } from '../auth/useAuth';

vi.mock('../auth/useAuth');

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      },
      checkSession: vi.fn().mockResolvedValue(true)
    });
  });

  it('renders sites list', async () => {
    render(<Sites />);
    expect(screen.getByText(/Sites WordPress/i)).toBeInTheDocument();
  });

  it('opens add site modal', async () => {
    render(<Sites />);
    fireEvent.click(screen.getByText(/Ajouter un site/i));
    expect(screen.getByText(/Informations de base/i)).toBeInTheDocument();
  });

  it('handles site creation', async () => {
    render(<Sites />);
    
    fireEvent.click(screen.getByText(/Ajouter un site/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/nom du site/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nom du site/i), {
      target: { value: 'Test Site' }
    });

    fireEvent.click(screen.getByText(/Sauvegarder/i));

    await waitFor(() => {
      expect(screen.getByText(/Test Site/i)).toBeInTheDocument();
    });
  });
});