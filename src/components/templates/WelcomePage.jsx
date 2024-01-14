import { NavBar } from "../molecules/NavBar.jsx";
import { SignInLink } from "../atoms/SignInLink.jsx";
import { SignUpLink } from "../atoms/SignUpLink.jsx";
import "./WelcomePage.css";

export function WelcomePage() {
  return (
    <body className="welcome-page-background ">
      <NavBar
        navItem={
          <div className="navlink-couple">
            <SignInLink />
            <SignUpLink />
          </div>
        }
      ></NavBar>
      <div className="information-grid">
        <h1 className="grid-header">
          Say hello to
          <img
            src="/buddy_images/buddy.webp"
            className="welcome-page-buddy-image"
          />
          <p className="test">Bucket Buddy</p>
        </h1>
        <img className="grid-image1" src="/CAT2.jpeg"></img>
        <p className="grid-text1">
          Create lists to maintain and track things you want to eventually
          complete.
        </p>
        <p className="grid-text2">
          Manage and complete your goals. No more falling into the habit of
          "saving it for later", then forgetting about it.
        </p>
        <img className="grid-image2" src="/CAT3.jpeg"></img>
        <img className="grid-image3" src="/CAT1.png"></img>
        <h1 className="grid-footer">
          Your privacy is important. Your data will never be sold.
        </h1>
      </div>
    </body>
  );
}
