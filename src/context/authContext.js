// dossier: context · fichier: authContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";  
import { loginUser } from "../lib/authService";   // ← seul appel backend pour l’instant
import { registerUser } from "../lib/authService"; // pour l’inscription

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //  state
  const [user,    setUser]    = useState(null);   // { id, role }
  const [loading, setLoading] = useState(true);   // true tant qu’on ne sait pas si loggé

  //  au chargement de l’app
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);          // { userId, role, exp, iat, … }
      setUser({ id: decoded.userId, role: decoded.role });
    }
    setLoading(false);
  }, []);

  //register
 const register = async (username, email, password) => {
  return await registerUser({ username, email, password });
};

  // login
  const login = async (credentials) => {
    const { token } = await loginUser(credentials);   // POST /api/users/login
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    setUser({ id: decoded.userId, role: decoded.role });
  };

  //  logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // expose au reste de l’app
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pratique pour consommer le contexte
export const useAuth = () => useContext(AuthContext);
