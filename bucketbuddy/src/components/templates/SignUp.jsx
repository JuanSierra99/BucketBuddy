import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink.jsx";
import FloatingInput from "../atoms/FloatingInput.jsx";
import { NavBar } from "../molecules/NavBar.jsx";

function SignUp() {
  return (
    <body
      style={{
        backgroundImage:
          'URL("https://static.vecteezy.com/system/resources/previews/010/527/184/original/liquid-flow-purple-purple-3d-neon-lava-lamp-geometric-background-for-banner-card-ui-design-or-wallpaper-gradient-mesh-bubble-in-the-shape-of-a-wave-drop-fluid-colorful-3d-tubes-free-vector.jpg")',
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <NavBar a={<a href="http://localhost:5173/sign-in">Sign in</a>}></NavBar>
      <img src="/buddy.png" className="buddy-image" />
      <div className="form-container">
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
    </body>
  );
}

export default SignUp;
