import { BucketBuddyLink } from "../atoms/BucketBuddyLink";
import "./NavBar.css";

{
  /*NavBar will always include BucketBuddyLink component. If it is the only link, then it will be centered.
 Additionaly, we can pass in a second Link Component, which results in links being spaced with (justify-content: space-between). */
}
export function NavBar({ navItem }) {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div>
          <BucketBuddyLink link="/" />
        </div>
        {navItem && <div>{navItem}</div>} {/*Only renders if prop passed in*/}
      </nav>
    </div>
  );
}
