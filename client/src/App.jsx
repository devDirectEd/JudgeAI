import { Routes, Route, Navigate, HashRouter, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";

// Page imports
import JudgeLogin from "./pages/login/judge/Login";
import AdminLogin from "./pages/login/admin/Login";
import AdminSignup from "./pages/login/admin/SignUp";
import JudgesDashboard from "./pages/judges/Dashboard";
import AdminDashboard from "./pages/admin/DashBoard";
import Score from "./pages/judges/Score";
import { checkAuthState } from "./redux/slices/AuthenticationSlice";
import "./App.css";

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
  const isScorePath = location.pathname.includes('/score/');

  if (!isAuthenticated) {
    return <Navigate to={`/${allowedRole}/login`} replace state={{ from: location }} />;
  }

  if (role !== allowedRole) {
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
  const location = useLocation();

  if (isAuthenticated && role && location.pathname.includes('/login')) {
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
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkAuthState()).unwrap();
      } catch (error) {
        console.log(error)
        // Silently handle rejection
      } finally {
        setIsInitializing(false);
      }
    };
    
    if (isInitializing) {
      initAuth();
    }
  }, [dispatch, isInitializing]);

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate 
            to={isAuthenticated ? `/${role}/dashboard` : '/admin/login'} 
            replace 
          />
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

      {/* Catch-all route */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={isAuthenticated ? 
              `/${role}/dashboard` : 
              (location.pathname.includes('/admin/') ? '/admin/login' : '/judge/login')} 
            replace 
          />
        } 
      />
    </Routes>
  );
}

const AppWrapper = () => {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
};

export default AppWrapper;