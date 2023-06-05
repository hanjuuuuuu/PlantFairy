import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContexProvider } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  <AuthContexProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </AuthContexProvider>
);
