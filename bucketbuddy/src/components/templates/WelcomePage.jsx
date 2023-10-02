import { BucketBuddyLink } from "../atoms/BucketBuddyLink";
import { NavBar } from "../molecules/NavBar.jsx";

export function WelcomePage() {
  return (
    <body>
      <NavBar
        navItem={<a href="http://localhost:5173/sign-up">Sign Up</a>}
      ></NavBar>
      <div className="information-grid">
        <h1 className="grid-header">
          This.
          <img src="/buddy.png" className="buddy-image" />
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
