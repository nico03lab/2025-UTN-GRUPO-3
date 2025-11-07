import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/axios";
import {useNavigate} from "react-router-dom"

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
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
    return data.user;
  };

  // Logout: borra token y usuario
  const logout = async () => {
  try {
    await axios.post("/auth/logout");
  } catch (err) {
    console.error("Error cerrando sesión en backend:", err.message);
  } finally {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  }
};


  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
