import { useEffect, useState } from "react";
import React from "react";
import { getJson, Post } from "../../../Backend/Requests";

export default function Table({ selectedTable }) {
  // Data for selected table
  const [rows, setRows] = useState([{}]);
  const [fields, setFields] = useState([]);
  const [dataType, setDataType] = useState("VARCHAR"); // For creating new columns

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
        setRows(json ? json : [{}]);
        setFields(fields ? fields : []);
        // setRows(json.length > 0 ? json : [{}]); //IS THIS GOOD ? WE GET ERROR IF DB HAS NO TABLES
        // setFields(fields.length > 0 ? fields : []);
      }
    };
    getTable();
  }, [selectedTable]);

  const handleInputChange = (e, index, key) => {
    const newDataSet = [...rows];
    newDataSet[index][key] = e.target.value;
    setRows(newDataSet);
  };

  const changeCell = (tableName, newCellValue, RecordId, fieldName) => {
    const url = "http://localhost:3000/api/change-cell";
    const jsonParameters = {
      name: tableName,
      rowId: RecordId,
      newCellValue,
      fieldName,
    };
    Post(url, jsonParameters);
  };

  const changeField = (tableName, currentFieldName, newFieldName) => {
    const url = "http://localhost:3000/api/change-field";
    const json = { tableName, currentFieldName, newFieldName };
    Post(url, json);
  };

  // const keys = Object.keys(table.length > 0 ? table[0] : {});
  const keys = fields; //when we use this, fields are not in order they are created
  return (
    <div>
      <h1 className="tableName">{selectedTable}</h1>
      <button
        onClick={async () => {
          const url = "http://localhost:3000/api/add-row";
          const json = { tableName: selectedTable };
          await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
        }}
      >
        Add Row
      </button>
      <button
        onClick={async () => {
          const url = "http://localhost:3000/api/add-column";
          const json = { tableName: selectedTable, columnName: " ", dataType };
          await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
        }}
      >
        Add Column
      </button>
      <select
        id="data-type"
        onChange={(e) => {
          setDataType(e.target.value);
        }}
      >
        <option value={"VARCHAR"}>Text</option>
        <option value={"INT"}>Number</option>
        <option value={"BOOL"}>Boolean</option>
      </select>
      <table>
        {/*make every key in our table a header*/}
        {keys.map((k, index) => {
          return (
            <th>
              <input
                type="text"
                value={fields[index]}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index] = e.target.value;
                  setFields(newFields);
                }}
                // onBlur={(e) => {changeField(selectedTable, e.)}}
              ></input>
            </th>
          );
        })}
        {/*for every object in our data set*/}
        {rows.map((record, recordIndex) => {
          return (
            <tr>
              {/*display the value for every key in the object*/}
              {keys.map((key, keyIndex) => {
                return (
                  <td>
                    <input
                      type="text"
                      value={record[key] ? record[key] : ""}
                      onBlur={(e) =>
                        changeCell(
                          selectedTable,
                          e.target.value,
                          record.unique_record_id,
                          key
                        )
                      }
                      onChange={(e) => {
                        handleInputChange(e, recordIndex, key);
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
      <button
        onClick={async () => {
          const url = "http://localhost:3000/api/add-row";
          const json = { tableName: selectedTable };
          await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
        }}
      >
        Add Row
      </button>
    </div>
  );
}
