import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink";
import FloatingInput from "../atoms/FloatingInput";

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

export default SignIn;
