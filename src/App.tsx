import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./shared/hooks/useAuth";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Chat from "./features/chat/pages/Chat";
import Profile from "./features/user/pages/Profile";
import ProtectedRoute from "./router/ProtectedRoute";
import { ChatProvider } from "./features/chat/context/ChatProvider";

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
