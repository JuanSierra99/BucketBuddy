import { useEffect, useState } from "react";
import React from "react";

// THIS NEEDS TO BE REVISED !

const getJson = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    // we return the json
    console.log(response.status + " " + response.statusText);
    const json = await response.json();
    return json;
  } else {
    // we do not return json
    console.log("Error: " + response.status + " " + response.statusText);
    return null;
  }
};

export default function Table({ selectedTable }) {
  // Data for selected table
  const [dataSet, setDataSet] = useState([{}]);
  const [fields, setFields] = useState([]);
  useEffect(() => {
    const getTable = async () => {
      const table_name = selectedTable;
      // ensure we have a table name before sending request to api
      if (table_name) {
        const url = `http://localhost:3000/api/get-table?name=${table_name}`;
        // If no json is returned, i believe json variable is undefined
        const json = await getJson(url);
        const fields = await getJson(
          `http://localhost:3000/api/table-fields?name=${table_name}`
        );
        setDataSet(json ? json : [{}]);
        setFields(fields ? fields : []);
        // setDataSet(json.length > 0 ? json : [{}]); //IS THIS GOOD ? WE GET ERROR IF DB HAS NO TABLES
        // setFields(fields.length > 0 ? fields : []);
      }
    };
    getTable();
  }, [selectedTable]);

  const handleInputChange = (e, index, key) => {
    const newDataSet = [...dataSet];
    newDataSet[index][key] = e.target.value;
    setDataSet(newDataSet);
  };

  //initialized to an array with one empty object
  //therefore if dataSet is never changed, keys.map will not render any <th> elements
  //similarly for dataset.map, that uses same dataSet array, so it also wont render anything
  // const keys = Object.keys(dataSet.length > 0 ? dataSet[0] : {});
  const keys = fields; //when we use this, fields are not in order they are created
  return (
    <div>
      <p>{selectedTable}</p>
      <table>
        {/*A table header for every key*/}
        {keys.map((k) => {
          return <th>{k}</th>;
        })}

        {/*for every object in our data set*/}
        {dataSet.map((data, dataIndex) => {
          return (
            <tr key={dataIndex}>
              {/*display the value for every key in the object*/}
              {keys.map((key, keyIndex) => {
                return (
                  <td key={keyIndex}>
                    <input
                      type="text"
                      value={data[key]}
                      onChange={(e) => {
                        handleInputChange(e, dataIndex, key);
                      }}
                      // onBlur={(e) => (e.target.value = "nooo")}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}
