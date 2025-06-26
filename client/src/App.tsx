import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Home, SignIn } from './routes';
import React from 'react';

function SignUp() {
  return <h1>Sign Up</h1>;
}

function User() {
  return <h1>User page</h1>;
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
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
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
