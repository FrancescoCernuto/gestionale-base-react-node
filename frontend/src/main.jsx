/**
 * main.jsx
 * Punto d'ingresso frontend + Toaster per notifiche
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        style: { background: "#343a40", color: "#fff" },
      }}
    />
  </React.StrictMode>
);
