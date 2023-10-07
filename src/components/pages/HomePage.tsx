import { useState } from "react";
import React from "react";
import { BucketBuddyLink } from "../atoms/BucketBuddyLink";
// import "/Users/juansierra/BucketBuddy/bucketbuddy/src/App.css";
// import "./HomePage.css";

// const testData = [
//   { Title: "0", Studio: 19, players: "Male" },
//   { Title: "1", Studio: 19, players: "Male" },
//   { Title: "2", Studio: 19, players: "Male" },
//   { Title: "3", Studio: 19, players: "Male" },
// ];

const Data = [
  {id: Date.now().toString(), Title: "Mary Sue"},
];

export function HomePage() {
  const [data, setData] = useState(Data);
  const addKey = () => {
    setData([...data, {id: Date.now().toString(), Title: "Mary Soo"}])
  }

  const [searchString, setSearchString] = useState("goo");

  return (
    <body>
      <button onClick={addKey}>Press Me</button>
      <div className="App">
        <table>
          <th>
            {Object.keys(Data[0]).map((key) => { //
              if(key != 'id'){
                return (<td>{key}</td>)
              }
            })}
          </th>
          {data.map((val) => {
            return (
              <tr>
                <input
        type="text"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
              </tr>
            );
          })}
        </table>
      </div>
    </body>
  );
}
