import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./components/templates/ErrorPage.jsx";
import { HomePage } from "./components/pages/HomePage";
import SignIn from "./components/templates/SignIn.jsx";
import SignUp from "./components/templates/SignUp.jsx";
import { WelcomePage } from "./components/templates/WelcomePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/sign-in",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/sign-up",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Home",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
]);

/*App is responsible for routing to our different pages*/
export default function App() {
  return <RouterProvider router={router} />;
}
