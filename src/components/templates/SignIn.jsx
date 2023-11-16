import FloatingInput from "../atoms/FloatingInput";
import { NavBar } from "../molecules/NavBar";
import { SignUpLink } from "../atoms/SignUpLink";
import { Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import { useState } from "react";

function SignIn() {
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    const apiUrl = `${serverUrl}/login`;
    const user = document.getElementById("username").value; // get value from username input (Change to use React state instead)
    const sendJson = { username: user };
    const response = await Post(apiUrl, sendJson); // post request, wait for json response w/ token (Should we do something if not authenticated ?)
    if (response.token) {
      localStorage.removeItem("jwtToken");
      localStorage.setItem("jwtToken", response.token); // save the jwt to local storage. Now it can be used to authenticate all our requests
    }
    return;
  };
  return (
    <div
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
        <form onSubmit={handleSubmit}>
          <FloatingInput
            value="username"
            type="text"
            id="username"
            name="username"
          />
          <FloatingInput
            value="password"
            type="password"
            id="password"
            name="password"
          />
          <input className="submit-form-button" type="submit" value="sign in" />
        </form>
        <a href="http://www.bing.com" className="forgot-password-link">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}

export default SignIn;
