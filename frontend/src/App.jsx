import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { ToastProvider } from './contexts/ToastContext';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/Dashboard';
import Toast from './components/ui/Toast';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading AI Task Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <TaskProvider>
          <Dashboard />
        </TaskProvider>
      ) : (
        <LoginForm />
      )}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}