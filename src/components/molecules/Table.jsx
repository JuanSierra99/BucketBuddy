import { useEffect, useState } from "react";
import React from "react";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import "./Table.css";

// selectedTable is in the form of {table_name: string, table_color: string}
export default function Table({ selectedTable }) {
  // Data for selected table
  const [rows, setRows] = useState([{}]); // The row data for the selected table
  const [fields, setFields] = useState([]); // An object representing table fields. Has a name, and data type
  const [dataType, setDataType] = useState("VARCHAR"); // Used for creating new columns. changes when user wants to select a different data type.

  // Make api request to get rows for the selected table.
  const getRows = async (table_name) => {
    const apiUrl = `${serverUrl}/api/get-table?table_name=${table_name}`;
    const json = await getJson(apiUrl); // If request failed, getJson returns null
    setRows(json ? json : [{ rows }]); // update the rows state
  };

  // Make api request to get fields from the selected table.
  const getFields = async (table_name) => {
    const apiUrl = `${serverUrl}/api/table-fields?table_name=${table_name}`;
    const new_fields = await getJson(apiUrl);
    if (new_fields) {
      setFields(new_fields); //update the fields state
    }
  };
  // Make a Post request to add a new row to the table. Refreshes table to show new row
  const addRow = async () => {
    const apiUrl = `${serverUrl}/api/add-row`;
    const json = { tableName: selectedTable.table_name };
    const response = await Post(apiUrl, json); //requests api endpoint to create new row. must await so that useEffect() or getRows() has updated info ?
    if (response) {
      getRows(selectedTable.table_name);
    }
  };

  // Make a Post request to add a new field/column to the table. Refreshes table to show new column
  const addField = async () => {
    const apiUrl = `${serverUrl}/api/add-column`;
    const json = {
      tableName: selectedTable.table_name,
      columnName: dataType,
      dataType,
    };
    await Post(apiUrl, json); //requests api endpoint to alter table.
    getFields(selectedTable.table_name);
  };

  // Mapping from SQL data types to corresponding JavaScript input types for rendering our table cells.
  const sql_to_js_types = {
    "character varying": "text",
    integer: "number",
    boolean: "checkbox",
    date: "date",
    "time without time zone": "Time",
  };

  // Get the data (rows and fields) for the table, and continue to do so whenever a new table is selected
  useEffect(() => {
    const table_name = selectedTable.table_name;
    if (table_name) {
      getRows(table_name);
      getFields(table_name);
    }
  }, [selectedTable.table_name]);

  // Update the state of the value in a table cell whenever it is changed.
  // Takes the event object (e), index of the row, and the key (column name) as parameters.
  const handleInputChange = (e, index, key) => {
    const newDataSet = [...rows]; // Create a copy of the current state to avoid direct mutation
    newDataSet[index][key] = e.target.value; // Update the value in the specified cell with the new input value
    setRows(newDataSet); // Update the state
  };

  // Make a request to the API to update the value in the database after the user has finished changing a cell's value.
  // Takes the table name, new cell value, record ID, and field name as parameters.
  const changeCellValue = (tableName, newCellValue, RecordId, fieldName) => {
    const apiUrl = `${serverUrl}/api/change-cell`;
    // Prepare the request payload
    const json = {
      name: tableName,
      rowId: RecordId,
      newCellValue,
      fieldName,
    };
    // Make a POST request to the API with the payload
    Post(apiUrl, json);
  };

  const changeField = (tableName, currentFieldName, newFieldName) => {
    const apiUrl = `${serverUrl}/api/change-field`;
    const json = { tableName, currentFieldName, newFieldName };
    Post(apiUrl, json);
  };

  return (
    <div className="table-container">
      <h1 style={{ color: selectedTable.table_color }} className="tableName">
        {selectedTable.table_name}
      </h1>
      <button className="top-table-button" onClick={addRow}>
        New Entry
      </button>
      <button className="top-table-button" onClick={addField}>
        Add Column
      </button>
      <select
        className="top-table-button"
        id="data-type"
        onChange={(e) => {
          setDataType(e.target.value);
        }}
      >
        <option value={"VARCHAR"}>Text</option>
        <option value={"INT"}>Number</option>
        <option value={"BOOL"}>Boolean</option>
        <option value={"DATE"}>Date</option>
        <option value={"JSON"}>JSON</option>
        <option value={"TIME"}>TIME</option>
      </select>
      <table style={{ backgroundColor: selectedTable.table_color }}>
        {/*make every key in our table a header*/}
        {fields.map((field_data, index) => {
          return (
            <th>
              <input
                type="text"
                value={field_data.column_name}
                // onChange={(e) => {
                //   const newFields = [...fields];
                //   newFields[index] = e.target.value;
                //   setFields(newFields);
                // }}
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
              {fields.map((field_data, keyIndex) => {
                return (
                  <td>
                    <input
                      type={sql_to_js_types[field_data.data_type]}
                      value={record[field_data.column_name] || ""}
                      onBlur={(e) =>
                        changeCellValue(
                          selectedTable.table_name,
                          e.target.value,
                          record.unique_record_id,
                          field_data.column_name
                        )
                      }
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          recordIndex,
                          field_data.column_name
                        );
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
        <button className="bottom-row-plus-button" onClick={addRow}>
          + Row
        </button>
      </table>
    </div>
  );
}
