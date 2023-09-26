import { useState } from "react";
import "./App.css";
import { BucketBuddyLink } from "./components/BucketBuddyLink.jsx";
import FloatingInput from "./components/FloatingInput";

function SignIn() {
  return (
    <body
      style={{
        backgroundImage:
          'URL("https://static.vecteezy.com/system/resources/previews/010/527/184/original/liquid-flow-purple-purple-3d-neon-lava-lamp-geometric-background-for-banner-card-ui-design-or-wallpaper-gradient-mesh-bubble-in-the-shape-of-a-wave-drop-fluid-colorful-3d-tubes-free-vector.jpg")',
      }}
    >
      <nav className="top-bar">
        <BucketBuddyLink link="http://www.bing.com" />
        {/* <img src="/src/assets/react.svg" style={{}} /> */}
        <a href="http://localhost:5173/sign-up">Sign Up</a>
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

function SignUp() {
  return (
    <body
      style={{
        backgroundImage:
          'URL("https://static.vecteezy.com/system/resources/previews/011/764/329/original/liquid-flow-purple-blue-3d-neon-lava-lamp-geometric-background-for-banner-card-ui-design-or-wallpaper-gradient-mesh-bubble-in-the-shape-of-a-wave-drop-fluid-colorful-abstract-shapes-free-vector.jpg")',
      }}
    >
      <nav className="top-bar">
        <BucketBuddyLink link="http://www.bing.com" />
        {/* <img src="/src/assets/react.svg" style={{}} /> */}
        <a href="http://localhost:5173/sign-in">Sign in</a>
      </nav>
      <img src="/buddy.png" className="buddy-image" />
      <div className="container">
        <form>
          <FloatingInput value="email" type="email" id="email" />
          <FloatingInput value="password" type="text" id="password" />
          <FloatingInput
            value="confirm-password"
            type="text"
            id="confirm-password"
          />
          <input className="signin-button" type="submit" value="sign up" />
        </form>
      </div>
      <header style={{ height: "1000px" }}></header>
    </body>
  );
}

export { SignIn, SignUp };
