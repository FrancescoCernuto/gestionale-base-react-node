/**
 * main.jsx - Monta correttamente Router + StoreProvider + Toaster
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.css";
import { StoreProvider } from "./context/StoreContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: { background: "#343a40", color: "#fff" },
          }}
        />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
