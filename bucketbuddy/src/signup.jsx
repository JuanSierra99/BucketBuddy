import "./App.css";
import { BucketBuddyLink } from "./components/BucketBuddyLink.jsx";
import FloatingInput from "./components/FloatingInput";

function SignUp() {
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
          <FloatingInput value="text" type="email" id="email" />
          <FloatingInput value="password" type="text" id="password" />
          <FloatingInput
            value="confirm-password"
            type="text"
            id="confirm-password"
          />
          <input className="signin-button" type="submit" value="sign up" />
        </form>
      </div>
    </body>
  );
}

export default SignUp;
