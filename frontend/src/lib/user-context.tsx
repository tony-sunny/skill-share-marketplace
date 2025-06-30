"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { parseJWTPayload } from "./utils";

interface User {
  id: number;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const user = parseJWTPayload<User>(token);
      if (user) {
        setUser(user);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
