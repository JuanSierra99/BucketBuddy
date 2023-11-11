// import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
import { serverUrl } from "../../../config.js";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink.jsx";
import FloatingInput from "../atoms/FloatingInput.jsx";
import { NavBar } from "../molecules/NavBar.jsx";
const config = require("./config");

const serverUrl = config.serverUrl;

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
      <NavBar
        navItem={
          <a href="/sign-in" className="navlink-signin">
            SIGN IN
          </a>
        }
      ></NavBar>
      <img src="/buddy.png" className="buddy-image" />
      <div className="form-container">
        <form method="Post" action={`${serverUrl}/register`}>
          <FloatingInput
            value="username"
            type="text"
            id="username"
            name="username"
          />
          <FloatingInput
            value="password"
            type="text"
            id="password"
            name="password"
          />
          {/* <FloatingInput
            value="confirm-password"
            type="text"
            id="confirm-password"
          /> */}
          <input className="submit-form-button" type="submit" value="sign up" />
        </form>
      </div>
    </body>
  );
}

export default SignUp;
