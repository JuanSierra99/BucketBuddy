import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <header>UHHHH THERES AN ERROR !?!?!?!</header>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
