import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SocketProvider } from "./context/socket";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketProvider>
      <>
        <App />
        <ToastContainer newestOnTop />
      </>
    </SocketProvider>
  </React.StrictMode>
);
