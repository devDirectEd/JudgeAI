import { Routes, Route, Navigate, HashRouter, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import JudgeLogin from "./pages/login/judge/Login";
import AdminLogin from "./pages/login/admin/Login";
import AdminSignup from "./pages/login/admin/SignUp";
import JudgesDashboard from "./pages/judges/Dashboard";
import AdminDashboard from "./pages/admin/DashBoard";
import Score from "./pages/judges/Score";
import "./App.css";
import { useEffect, useState } from "react";
import { checkAuthState } from "./redux/slices/AuthenticationSlice";
import { Spinner } from "@chakra-ui/react";

// Simple loading component - you can style this as needed
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: "black" 
  }}>
    <Spinner className="text-4xl" size='xl' color='blue.500' />
  </div>
);

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const isScorePath = location.pathname.includes('/score/');

  useEffect(() => {
    // Add a small delay to ensure auth check completes
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${allowedRole}/login`} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (isScorePath) {
      const scoreId = location.pathname.split('/').pop();
      return <Navigate to={`/${role}/dashboard/score/${scoreId}`} replace />;
    }
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500); // Adjust this delay as needed

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRole: PropTypes.oneOf(['admin', 'judge']).isRequired
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(checkAuthState());
      // Add a small delay after the auth check
      setTimeout(() => {
        setIsInitializing(false);
      }, 500); // Adjust this delay as needed
    };
    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  return (
    <HashRouter>
      <Routes>
        {/* Routes remain the same */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${role}/dashboard`} replace />
            ) : (
              <Navigate to="/judge/login" replace />
            )
          }
        />

        {/* Judge Routes */}
        <Route
          path="/judge/login"
          element={
            <PublicRoute>
              <JudgeLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/judge/dashboard"
          element={
            <ProtectedRoute allowedRole="judge">
              <JudgesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge/dashboard/score/:id"
          element={
            <ProtectedRoute allowedRole="judge">
              <Score />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/signup"
          element={
            <PublicRoute>
              <AdminSignup />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={isAuthenticated ? 
                `/${role}/dashboard` 
                : '/judge/login'} 
              replace 
            />
          } 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;