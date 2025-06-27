import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, SignIn, SignUp, Dashboard, User } from './routes';
import { useAuth } from './contexts/AuthContext';
import React from 'react';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <User /> : <Home />} />
        <Route path="/sign-in" element={
          <PublicOnlyRoute>
            <SignIn />
          </PublicOnlyRoute>
        } />
        <Route path="/sign-up" element={
          <PublicOnlyRoute>
            <SignUp />
          </PublicOnlyRoute>
        } />
        <Route path="/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
