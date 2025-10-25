import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { BarChart3 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Project from './pages/Project';
import AdminPanel from './pages/AdminPanel';
import Schedule from './pages/Schedule';
import Backlog from './pages/Backlog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/project/:id" element={
              <ProtectedRoute>
                <Layout>
                  <Project />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/schedule" element={
              <ProtectedRoute>
                <Layout>
                  <Schedule />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/backlog" element={
              <ProtectedRoute>
                <Layout>
                  <Backlog />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Coming Soon Routes */}
            <Route path="/reporting" element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Reporting</h3>
                      <p className="mt-1 text-sm text-gray-500">Coming Soon</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/metrics" element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Metrics</h3>
                      <p className="mt-1 text-sm text-gray-500">Coming Soon</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect to dashboard for unknown routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
