// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import AuthProvider from "./context/AuthProvider";

const serverBasename =
  window.location.hostname === "localhost"
    ? "/"
    : "/testing/react/usm-pulse";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename={serverBasename}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);