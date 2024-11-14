import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/cache';
import { ThemeProvider } from './utils/theme/ThemeContext';
import App from './App';
import './index.css';

// Import Firebase config
import './config/firebase';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);