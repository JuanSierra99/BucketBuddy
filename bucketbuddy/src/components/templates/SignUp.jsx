import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink.jsx";
import FloatingInput from "../atoms/FloatingInput.jsx";

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

export default SignUp;
