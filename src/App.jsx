import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import Footer from './components/footer/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'; 
import PrivateRoute from './components/auth/PrivateRoute';
import NavBar from './components/navbar/navbar';
import MinimalNavBar from './components/navbar/MinimalNavBar';  // Minimal navbar
// import MamDataAnalysis from './components/Login/AfterLogin/dataAnalysis';

// Lazy load components for better performance
const Homepage = lazy(() => import('./components/homepage/Homepage'));
const LoginOptions = lazy(() => import('./components/auth/LoginOptions'));
const NewRegistrationForm = lazy(() => import('./components/Login/AfterLogin/NewRegistration'));
const MainProgram = lazy(() => import('./components/Login/AfterLogin/MainProgram'));
const BigDataAnalysis = lazy(() => import('./components/Login/AfterLogin/BigdataAnalysis'));
const AdminLoginForm = lazy(() => import('./components/Login/AdminLoginForm'));
const PlayBackVideo = lazy(() => import('./components/Login/AfterLogin/PlackbackVideo'))
const LiveVideo = lazy(() => import('./components/Login/AfterLogin/LiveVideo'))
const NavWrapper = ({ children }) => {
  const location = useLocation();

  // List of routes that require MinimalNavBar
  const minimalNavRoutes = [
    '/AdminLoginForm',
    '/new-registration',
    '/main-program',
    '/data-analysis',
    '/mam-data-analysis',
    '/LiveVideo',
    '/PlayBackVideo',
  ];

  // Check if the current route matches any of the minimalNavRoutes
  const isMinimalNavRoute = minimalNavRoutes.includes(location.pathname);

  return (
    <>
      {/* Always render NavBar for "/" */}
      {location.pathname === '/' ? <NavBar /> : (isMinimalNavRoute ? <MinimalNavBar /> : <NavBar />)}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <NavWrapper> {/* Wrap the Routes with NavWrapper */}
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/AdminLoginForm" element={<AdminLoginForm />} />
              <Route path="/login-options" element={<LoginOptions />} />

              {/* Private Routes */}
              <Route 
                path="/livevideo" 
                element={
                  <PrivateRoute>
                    <LiveVideo />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/new-registration" 
                element={
                  <PrivateRoute>
                    <NewRegistrationForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/main-program" 
                element={
                  <PrivateRoute>
                    <MainProgram />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/data-analysis" 
                element={
                  <PrivateRoute>
                    <BigDataAnalysis />
                  </PrivateRoute>
                } 
              />
              {/* <Route 
                path="/mam-data-analysis" 
                element={
                  <PrivateRoute>
                    <MamDataAnalysis />
                  </PrivateRoute>
                } 
              /> */}
              <Route 
                path="/PlayBackVideo" 
                element={
                  <PrivateRoute>
                    <PlayBackVideo/>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/livevideo" 
                element={
                  <PrivateRoute>
                    <LiveVideo/>
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Suspense>
        </NavWrapper>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
