import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Rol {
  id: number;
  rol: string;
}

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  username?: string;
  rol: Rol | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    nombre: string,
    apellido: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    !!localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost/agrosoft_php/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el login");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.token);
      setAuthenticated(true);

      const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
      const userData: User = {
        id: decodedToken.data.id,
        nombre: decodedToken.data.nombre || '',
        apellido: decodedToken.data.apellido || '',
        email: decodedToken.data.email,
        rol: {
          id: decodedToken.data.rol,
          rol: decodedToken.data.rol === 1 ? 'Admin' : 'User',
        },
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      setAuthenticated(false);
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      throw new Error("No se pudo conectar al servidor. Verifica tu conexión o intenta más tarde.");
    }
  };

  const register = async (
    nombre: string,
    apellido: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch("http://localhost/agrosoft_php/usuario/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      const data = await response.json();
      console.log("Registro exitoso:", data);

      navigate("/login");
    } catch (error) {
      console.error("Error en registro:", error);
      throw new Error("No se pudo completar el registro. Verifica los datos e intenta nuevamente.");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};