import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./hooks/useAuth";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./router/ProtectedRoute";
import { ChatProvider } from "./context/ChatProvider";

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
              <ChatProvider>
                <Chat />
              </ChatProvider>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
