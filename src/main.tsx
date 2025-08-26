import "./sentry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./shared/context/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { ConversationsProvider } from "./shared/context/ConversationsContext.tsx";
import { AvatarPreviewProvider } from "./shared/context/AvatarPreviewContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AvatarPreviewProvider>
          <ConversationsProvider>
            <App />
          </ConversationsProvider>
        </AvatarPreviewProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
