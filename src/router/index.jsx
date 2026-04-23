import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import LoginLayout from "@/layouts/LoginLayout";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Research from "@/pages/Research";
import Roadmap from "@/pages/Roadmap";
import LandingPage from "@/pages/LandingPage";
import SignupPage from "@/pages/SignupPage";
import SignupCompletePage from "@/pages/SignupCompletePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <LoginLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: "signup", element: <SignupPage /> },
          { path: "signup/complete", element: <SignupCompletePage /> },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "Research", element: <Research /> },
          { path: "roadmap", element: <Roadmap /> },
        ],
      },
    ],
  },
]);
