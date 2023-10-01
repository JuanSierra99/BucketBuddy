import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink.jsx";
import FloatingInput from "../atoms/FloatingInput.jsx";

function SignUp() {
  return (
    <body>
      <div className="navbar-container">
        <nav className="navbar">
          <BucketBuddyLink link="http://localhost:5173/sign-in" />
          <a href="http://localhost:5173/sign-in">Sign in</a>
        </nav>
      </div>

      <div className="signup-half">
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
      </div>

      <div className="information-grid">
        <h1 className="grid-header">
          This.
          <br />
          Is Bucket Buddy
        </h1>
        <img className="grid-image1" src="/CAT2.jpeg"></img>
        <p className="grid-text1">
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit...
        </p>
        <p className="grid-text2">
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit...
        </p>
        <img className="grid-image2" src="/CAT3.jpeg"></img>
        <img className="grid-image3" src="/CAT1.png"></img>
        <h1 className="grid-footer">
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit
        </h1>
      </div>
    </body>
  );
}

export default SignUp;
