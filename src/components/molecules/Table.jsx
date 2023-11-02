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

const Post = async (json) => {
  const response = await fetch("http://localhost:3000/api/change-cell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
  if (response.ok) {
    console.log(response.status + " " + response.statusText);
    const json = await response.json();
    return json;
  } else {
    console.log("Error: " + response.status + " " + response.statusText);
  }
};

export default function Table({ selectedTable }) {
  // Data for selected table
  const [table, setTable] = useState([{}]);
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
        setTable(json ? json : [{}]);
        setFields(fields ? fields : []);
        // setTable(json.length > 0 ? json : [{}]); //IS THIS GOOD ? WE GET ERROR IF DB HAS NO TABLES
        // setFields(fields.length > 0 ? fields : []);
      }
    };
    getTable();
  }, [selectedTable]);

  const handleInputChange = (e, index, key) => {
    const newDataSet = [...table];
    newDataSet[index][key] = e.target.value;
    setTable(newDataSet);
  };

  const changeCell = (tableName, newCellValue, RecordId, fieldName) => {
    Post({ name: tableName, rowId: RecordId, newCellValue, fieldName });
  };

  //table is initialized to an array with one empty object
  //therefore if table is never changed, keys.map will not render any <th> elements
  //similarly for table.map, that uses same table array, so it also wont render anything
  // const keys = Object.keys(table.length > 0 ? table[0] : {});
  const keys = fields; //when we use this, fields are not in order they are created
  return (
    <div>
      <p>{selectedTable}</p>
      <table>
        {/*make every key in our table a header*/}
        {keys.map((k) => {
          return <th>{k}</th>;
        })}
        {/*for every object in our data set*/}
        {table.map((record, recordIndex) => {
          return (
            <tr key={record.id}>
              {/*display the value for every key in the object*/}
              {keys.map((key, keyIndex) => {
                return (
                  <td key={keyIndex}>
                    <input
                      type="text"
                      value={record[key]}
                      onBlur={(e) =>
                        changeCell(
                          selectedTable,
                          e.target.value,
                          record.id,
                          key
                        )
                      }
                      onChange={(e) => {
                        handleInputChange(e, recordIndex, key);
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
