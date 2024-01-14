import FloatingInput from "../atoms/FloatingInput";
import { NavBar } from "../molecules/NavBar";
import { SignUpLink } from "../atoms/SignUpLink";
import { Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

function SignIn() {
  const [authenticated, setAuthenticated] = useState(false); //If authenticated,
  const navigation = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    const apiUrl = `${serverUrl}/api/login`;
    const user = document.getElementById("username").value; // get value from username input (Change to use React state instead)
    const sendJson = { username: user };
    const response = await Post(apiUrl, sendJson); // post request, wait for json response w/ token (Should we do something if not authenticated ?)
    if (response.token) {
      // setAuthenticated(true);
      navigation("/Home");
      localStorage.removeItem("jwtToken");
      localStorage.setItem("jwtToken", response.token); // save the jwt to local storage. Now it can be used to authenticate all our requests
    }
    return;
  };
  return (
    <div className="sign-in-up-page">
      <NavBar navItem={<SignUpLink />}></NavBar>
      <img src="/buddy_images/buddy-smile.webp" className="buddy-image" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <FloatingInput
            value="username"
            type="text"
            id="username"
            name="username"
            placeholder="username"
          />
          <FloatingInput
            value="password"
            type="password"
            id="password"
            name="password"
            placeholder="password"
          />
          <input className="submit-form-button" type="submit" value="sign in" />
        </form>
        {/* <a href="http://www.bing.com" className="forgot-password-link">
          Forgot Password?
        </a> */}
      </div>
    </div>
  );
}

export default SignIn;
