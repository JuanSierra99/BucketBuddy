import { useState } from "react";
import "./App.css";
import { BucketBuddyLink } from "./components/BucketBuddyLink.jsx";
import FloatingInput from "./components/FloatingInput";

function App() {
  return (
    <body>
      <nav className="top-bar">
        <BucketBuddyLink link="http://www.bing.com" />
        <img src="/src/assets/react.svg" style={{}} />
        <a href="https://react.dev">Sign in</a>
      </nav>
      <img src="/buddy.png" className="buddy-image" />
      <div>
        <form className="container">
          <FloatingInput value="username" type="email" id="username" />
          <FloatingInput value="password" type="password" id="password" />
          <input class="signin-button" type="submit" value="sign in" />
        </form>
      </div>
    </body>
  );
}

export default App;
