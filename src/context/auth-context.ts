import { createContext } from "react";
import type { DecodedToken } from "../types/DecodedToken";

export type AuthContextType = {
  user: DecodedToken | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
