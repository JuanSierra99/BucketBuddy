import "./BucketBuddyLink.css";
function BucketBuddyLink({ link }) {
  return (
    <a class="top-bar-bucketbuddy" href={link ? link : ""}>
      Bucket Buddy
    </a>
  );
}
export { BucketBuddyLink };
