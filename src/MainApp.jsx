import React, { useState, useEffect } from 'react';
import PersonalizedApp from './components/PersonalizedApp';
import AuthPage from './components/AuthPage';
import AdminPanel from './components/AdminPanel';

/**
 * Main application component that handles authentication flow
 * Controls access to the PersonalizedApp, AuthPage, and AdminPanel
 */
const MainApp = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Check for existing session on mount
  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('shadow_os_user_data');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setCurrentUser(parsedUserData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear corrupted data
        localStorage.removeItem('shadow_os_user_data');
      }
    }
  }, []);
  
  /**
   * Handle successful login
   * @param {Object} userData - The authenticated user's data
   */
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(false); // Regular user login
  };
  
  /**
   * Handle signup - redirects to onboarding in PersonalizedApp
   * @param {string} fullName - The user's full name
   */
  const handleSignup = (fullName) => {
    // Save temporary user data
    localStorage.setItem('shadow_os_user_name', fullName);
    setIsAuthenticated(true);
  };
  
  /**
   * Check for admin credentials and grant access if valid
   * @param {string} fullName - The entered full name
   * @param {string} pin - The entered PIN
   * @returns {boolean} - Whether admin access was granted
   */
  const checkAdminAccess = (fullName, pin) => {
    // Check against hardcoded admin credentials
    // In a production app, this would use secure authentication
    if (fullName === "Morris Dawakai" && pin === "2005mayexcellent") {
      // Grant admin access
      setCurrentUser({ 
        fullName: "Morris Dawakai", 
        isAdmin: true,
        role: "Architect"
      });
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  
  /**
   * Handle logout for both regular users and admin
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    // Don't clear localStorage on logout to persist user settings
  };
  
  // Render appropriate component based on auth state
  if (!isAuthenticated) {
    return (
      <AuthPage 
        onLogin={handleLogin}
        onSignup={handleSignup}
        adminAccessCheck={checkAdminAccess}
      />
    );
  }
  
  // If admin is authenticated, show admin panel
  if (isAdmin) {
    return <AdminPanel onLogout={handleLogout} />;
  }
  
  // Otherwise, show the regular personalized app
  return <PersonalizedApp />;
};

export default MainApp;