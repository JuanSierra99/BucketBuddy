import { NavBar } from "../molecules/NavBar.jsx";
import { SignInLink } from "../atoms/SignInLink.jsx";
import { SignUpLink } from "../atoms/SignUpLink.jsx";
import "./WelcomePage.css";

export function WelcomePage() {
  return (
    <body className="welcome-page-background">
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
          Say Hello To
          <img src="/buddy.png" className="welcome-page-buddy-image" />
          <p className="test">Bucket Buddy</p>
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
