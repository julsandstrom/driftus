import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <div>
              <Profile />
              <Chat />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
