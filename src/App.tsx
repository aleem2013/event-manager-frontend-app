import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // Updated import
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import CreateEvent from './components/CreateEvent';
import ScanQR from './components/ScanQR';
import { Toaster } from 'react-hot-toast';
import TicketDetails from './components/TicketDetails';
import Login from './components/Login';
import Register from './components/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n/config'; // Import i18n configuration

// Configure QueryClient with some defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);


// Separate component for the app content to use hooks inside
const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      {/* <WelcomeMessage isAuthenticated={isAuthenticated} username={user?.name} /> */}
      <main className="flex-grow">
      {/* <div className="container mx-auto px-4 py-8"> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <EventList />
            </ProtectedRoute>
          } />
          <Route path="/events/:id" element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          } />
          <Route path="/events/:eventId/tickets/:ticketId" element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          } />
          <Route path="/create-event" element={
            <ProtectedRoute requireAdmin={true}>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/scan" element={
            <ProtectedRoute>
              <ScanQR />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {/* </div> */}
      <Footer />
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          {/* <div className="min-h-full"> */}
            {/* <AppContent /> */}
          {/* </div> */}
          <Suspense fallback={<LoadingSpinner />}>
            <AppContent />
          </Suspense>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};
/*
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <WelcomeMessage isAuthenticated={true} username="John" />
              <div className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <EventList />
                    </ProtectedRoute>
                  } />
                  <Route path="/events/:id" element={
                    <ProtectedRoute>
                      <EventDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/events/:eventId/tickets/:ticketId" element={
                    <ProtectedRoute>
                      <TicketDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-event" element={
                    <ProtectedRoute requireAdmin={true}>
                      <CreateEvent />
                    </ProtectedRoute>
                  } />
                  <Route path="/scan" element={
                    <ProtectedRoute>
                      <ScanQR />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
              <Toaster />
            </div>
          </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}; */

export default App;