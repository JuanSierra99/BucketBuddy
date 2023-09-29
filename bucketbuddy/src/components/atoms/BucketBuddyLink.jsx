import "./BucketBuddyLink.css";
function BucketBuddyLink({ link }) {
  return (
    <a class="top-bar-bucketbuddy" href={link ? link : "http://www.google.com"}>
      Bucket Buddy
    </a>
  );
}
export { BucketBuddyLink };
