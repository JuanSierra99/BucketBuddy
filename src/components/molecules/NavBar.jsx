import { BucketBuddyLink } from "../atoms/BucketBuddyLink";
import "./NavBar.css";

export function NavBar({ navItem }) {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div>
          <BucketBuddyLink link="/" />
        </div>
        {navItem}
      </nav>
    </div>
  );
}

// NavBar always has Bucket Buddy component in it, but a second item can be passed in.
// If only BucketBuddyLink is in navbar, then it will be centered
// Else, there will be space between the two (justify-content: space-between)
