import { useState } from "react";
import "./App.css";
import { BucketBuddyLink } from "./components/BucketBuddyLink.jsx";
import FloatingInput from "./components/FloatingInput";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

function App() {
  return (
    <body>
      <nav className="top-bar">
        <BucketBuddyLink link="http://www.bing.com" />
        {/* <img src="/src/assets/react.svg" style={{}} /> */}
        <a href="https://react.dev">Sign in</a>
      </nav>
      <img src="/buddy.png" className="buddy-image" />
      <div className="container">
        <form>
          <FloatingInput value="username" type="email" id="username" />
          <FloatingInput value="password" type="password" id="password" />
          <input className="signin-button" type="submit" value="sign in" />
        </form>
        <a href="http://www.bing.com" class="forgot-password-link">
          Forgot Password?
        </a>
      </div>
    </body>
  );
}

export default App;
