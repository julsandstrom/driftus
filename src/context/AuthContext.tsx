import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  user: string;
  email: string;
  avatar: string;
  invite: null;
  iat: number;
  exp: number;
};

type AuthContextType = {
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log(jwtDecode(storedToken));
      const decoded: DecodedToken = jwtDecode(storedToken);
      const now = Date.now() / 1000;

      if (decoded.exp > now) {
        setUser(decoded);
      } else {
        console.log("token expired");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);
  const login = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  if (loading) return null;
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
