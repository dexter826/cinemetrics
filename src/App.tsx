import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/providers/AuthProvider';
import { ToastProvider } from './components/contexts/Toast';
import { AlertProvider } from './components/contexts/Alert';
import { AddMovieProvider, useAddMovie } from './components/contexts/AddMovieContext';
import { ExportProvider } from './components/contexts/ExportContext';
import Login from './components/auth/Login';
import Dashboard from './components/pages/Dashboard';
import SearchPage from './components/pages/SearchPage';
import StatsPage from './components/pages/StatsPage';
import AlbumsPage from './components/pages/AlbumsPage';
import AlbumDetailPage from './components/pages/AlbumDetailPage';
import AddMovieModal from './components/modals/AddMovieModal';
import Layout from './components/layout/Layout';
import SplashScreen from './components/ui/SplashScreen';
import { ThemeProvider } from './components/providers/ThemeProvider';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isSplashing, setIsSplashing] = useState(() => !sessionStorage.getItem('splashScreenShown'));

  useEffect(() => {
    if (isSplashing) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('splashScreenShown', 'true');
        setIsSplashing(false);
      }, 2000); // Splash screen minimum time

      return () => clearTimeout(timer);
    }
  }, [isSplashing]);

  // If splash screen is active, show it.
  if (isSplashing) {
    return <SplashScreen onAnimationFinish={() => {}} />;
  }

  // After splash, if auth is still loading, show a blank screen to prevent flashing Login page.
  if (authLoading) {
    return null;
  }

  // Once splash and auth are done, render the appropriate component.
  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AddMovieModal />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AlertProvider>
              <AddMovieProvider>
                <ExportProvider>
                  <Layout>
                    <AppContent />
                  </Layout>
                </ExportProvider>
              </AddMovieProvider>
            </AlertProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;