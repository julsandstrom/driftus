import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./shared/context/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { ConversationsProvider } from "./shared/context/ConversationsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConversationsProvider>
          <App />
        </ConversationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
