import { createContext } from "react";
import type { DecodedToken } from "../types/DecodedToken";

export type AuthContext = {
  user: DecodedToken | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext;

export default AuthContext;
