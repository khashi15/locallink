import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@asgardeo/auth-react";
import { asgardeoConfig } from "./config/asgardeo.config";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider config={asgardeoConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
