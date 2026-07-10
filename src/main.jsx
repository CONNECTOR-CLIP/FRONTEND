import { StrictMode } from "react";
import "@/index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";

// 앱 진입점 — #root 엘리먼트에 React 트리를 마운트
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
