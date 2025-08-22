import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import type { DecodedToken } from "../types";
import AuthContext from "./auth-context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const refreshUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.log("Missing token");
      navigate("/login");
      setLoading(false);
      return;
    }
    const decoded: DecodedToken = jwtDecode(storedToken);
    const now = Date.now() / 1000;

    if (decoded.exp <= now) {
      console.log("Token expired");
      localStorage.removeItem("token");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://chatify-api.up.railway.app/users/${decoded?.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const [fetchedUser] = await res.json();

      setUser({
        id: fetchedUser.id.toString(),
        user: fetchedUser.username,
        email: fetchedUser.email,
        avatar: fetchedUser.avatar,
        invite: fetchedUser.invite,
        iat: decoded.iat,
        exp: decoded.exp,
      });
    } catch (err) {
      console.log(err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      setLoading(false);
      return;
    }

    refreshUser().finally(() => setLoading(false));
  }, [location.pathname]);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await refreshUser();
  };

  const logout = () => {
    const confirm = window.confirm("You sure you want to logout?");
    if (!confirm) return;
    localStorage.removeItem("token");
    console.log("Deleting token");
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
