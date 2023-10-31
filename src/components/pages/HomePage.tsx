import { useEffect, useState } from "react";
import React from "react";
import TextInput from "../atoms/TextInput";
import { error } from "console";
import { json } from "stream/consumers";

const url = "http://localhost:3000";

const getJson = async (url) => {
  const response = await fetch(url);
      if (response.ok) {
        console.log(response.status + " " + response.statusText);
        const json = await response.json();
        return json
      } else {
        console.log("Error: " + response.status + " " + response.statusText);
      }
}

export function HomePage() {
  const [dataSet, setDataSet] = useState([{}]);
  const [tables, setTables] = useState([{}]);

  useEffect(() => {
    const getTable = async () => {
      const table_name = "test";
      const url = `http://localhost:3000/table?name=${table_name}`;
      const json = await getJson(url)
      setDataSet(json)
    }
    const getTables = async () => {
      const url = "http://localhost:3000/api/tables"
      const json = await  getJson(url)
      setTables(json.table_names)
    }
    getTable();
    getTables();
  }, []);
  //initialized to an array with one empty object
  //therefore if dataSet is never changed, keys.map will not render any <th> elements
  //similarly for dataset.map, that uses same dataSet array, so it also wont render anything
  const keys = Object.keys(dataSet[0]); 

  return (
    <div>
      {JSON.stringify(tables)}
      <table>
        {/*A table header for every key*/}
        {keys.map((k) => {
          return <th>{k}</th>;
        })}

        {/*for every object in our data set*/}
        {dataSet.map((data, n) => {
          return (
            <tr key={n}>
              {/*display the value for every key in the object*/}
              {keys.map((k, n) => {
                return (
                  <td>
                    <input key={n} type="text" value={data[k]} />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
      {/* <p>{JSON.stringify(dataSet)}</p> */}
    </div>
  );
}
