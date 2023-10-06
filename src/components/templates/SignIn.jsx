import FloatingInput from "../atoms/FloatingInput";
import { NavBar } from "../molecules/NavBar";
import { SignUpLink } from "../atoms/SignUpLink";

function SignIn() {
  return (
    <body
      style={{
        backgroundImage:
          'URL("https://static.vecteezy.com/system/resources/previews/010/527/184/original/liquid-flow-purple-purple-3d-neon-lava-lamp-geometric-background-for-banner-card-ui-design-or-wallpaper-gradient-mesh-bubble-in-the-shape-of-a-wave-drop-fluid-colorful-3d-tubes-free-vector.jpg")',
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <NavBar navItem={<SignUpLink />}></NavBar>
      <img src="/buddy-smile.png" className="buddy-image" />
      <div className="form-container">
        <form>
          <FloatingInput value="username" type="email" id="username" />
          <FloatingInput value="password" type="password" id="password" />
          <input className="submit-form-button" type="submit" value="sign in" />
        </form>
        <a href="http://www.bing.com" class="forgot-password-link">
          Forgot Password?
        </a>
      </div>
    </body>
  );
}

export default SignIn;
