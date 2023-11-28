import "./BucketBuddyLink.css";
function BucketBuddyLink({ link }) {
  return (
    <a className="top-bar-bucketbuddy" href={link ? link : ""}>
      Bucket Buddy
    </a>
  );
}
export { BucketBuddyLink };
