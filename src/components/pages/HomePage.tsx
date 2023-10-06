import { useState } from "react";
import React from "react";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink";
// import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
// import "./HomePage.css";

const data = [
  { Title: "0", Studio: 19, players: "Male" },
  { Title: "1", Studio: 19, players: "Male" },
  { Title: "2", Studio: 19, players: "Male" },
  { Title: "3", Studio: 19, players: "Male" },
];

export function HomePage() {
  // const [ata, setData] = useState(0);
  return (
    <body style={{ backgroundColor: "white" }}>
      <div className="App">
        <table>
          <tr>
            <td>Title</td>
            <td>Studio</td>
            <td>players</td>
          </tr>
          {data.map((val) => {
            return (
              <tr>
                <td>{val.Title}</td>
                <td>{val.Studio}</td>
                <td>{val.players}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </body>
  );
}
