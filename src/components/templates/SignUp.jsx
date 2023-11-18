// import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink.jsx";
import FloatingInput from "../atoms/FloatingInput.jsx";
import { NavBar } from "../molecules/NavBar.jsx";
import { serverUrl } from "../../config";

function SignUp() {
  return (
    <div className="sign-in-up-page">
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
    </div>
  );
}

export default SignUp;
