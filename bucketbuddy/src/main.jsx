import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn, SignUp } from "./App.jsx";
import ErrorPage from "./ErrorPage.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <p>Reserved for HomePage</p>
      </div>
    ),
    errorElement: ErrorPage,
  },

  {
    path: "/sign-in",
    element: <SignIn />,
    errorElement: ErrorPage,
  },

  {
    path: "/sign-up",
    element: <SignUp />,
    errorElement: ErrorPage,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
