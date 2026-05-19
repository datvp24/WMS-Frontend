// File: src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
// ✅ KHÔNG wrap InventoryChangeProvider ở đây
// Provider đã có trong App.tsx rồi, chỉ cần 1 lần

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);