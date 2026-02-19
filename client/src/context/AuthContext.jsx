import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [aiConsent, setAiConsent] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const savedConsent = localStorage.getItem("ai_data_consent");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setAiConsent(savedConsent || null);
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    const existingConsent = localStorage.getItem("ai_data_consent");
    if (!existingConsent) {
      setShowConsentModal(true);
    } else {
      setAiConsent(existingConsent);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAiConsent(null);
  };

  const handleConsent = (decision) => {
    setAiConsent(decision);
    setShowConsentModal(false);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, aiConsent, showConsentModal, setShowConsentModal, handleConsent }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
