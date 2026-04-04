import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import LandingPage from "@/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: "home", element: <Home /> },
        ],
      },
    ],
  },
]);
