import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Provider: envuelve toda tu app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Verificar si hay token y obtener el usuario al inicio
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setReady(true);
      return;
    }

    axios
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
      })
      .finally(() => setReady(true));
  }, []);

  // Login: guarda token y usuario
  const login = async (nombreUsuario, pass) => {
    const { data } = await axios.post("/auth/login", { nombreUsuario, pass });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    console.log("👤 Usuario guardado:", data.user); // 👈 DEBUG
    return data.user;
  };

  // Logout: borra token y usuario
  const logout = async () => {
    await axios.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
