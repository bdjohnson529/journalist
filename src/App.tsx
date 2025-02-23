import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { LoginForm } from './components/Auth/LoginForm';
import { HandwritingUploader } from './components/HandwritingUploader/HandwritingUploader';
import { JournalEntriesList } from './components/JournalEntries/JournalEntriesList';
import { Navigation } from './components/Navigation/Navigation';
import { Insights } from './components/Insights/Insights';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={
            <ProtectedRoute>
              <div className="min-h-screen w-full bg-blue-50">
                <Navigation />
                <div className="flex flex-col items-center justify-start py-8">
                  <HandwritingUploader />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <div className="min-h-screen w-full bg-blue-50">
                <Navigation />
                <div className="flex flex-col items-center justify-start py-8">
                  <JournalEntriesList />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute>
              <div className="min-h-screen w-full bg-blue-50">
                <Navigation />
                <div className="flex flex-col items-center justify-start py-8">
                  <Insights />
                </div>
              </div>
            </ProtectedRoute>
          } />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
