import { useEffect, useState } from "react";
import React from "react";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import { InputBox } from "../atoms/InputBox";
import "./Table.css";

// selectedTable is in the form of {table_name: string, table_color: string }
export default function Table({ selectedTable }) {
  // Data for selected table
  const [rows, setRows] = useState([{}]); // The row data for the selected table
  const [fields, setFields] = useState([]); // An object representing table fields. Has a name, and data type
  const [dataType, setDataType] = useState("VARCHAR"); // Used for creating new columns. changes when user wants to select a different data type.
  const [filterFunctions, setFilterFunctions] = useState({}); // Holds key value pairs, where key is field/column name, and filter function to be applied to rows is the value
  const [newFieldName, setNewFieldName] = useState("");

  // Get the data (rows and fields) for the table, and continue to do so whenever a new table is selected
  useEffect(() => {
    const table_name = selectedTable.table_name;
    if (table_name) {
      getRows(table_name); // get tables rows
      getFields(table_name); // get tables fields
      setFilterFunctions([]); // unapply all filters when switching tables
    }
  }, [selectedTable.table_name]);

  // When a new filter is added, apply it to the rows. This alters the table
  useEffect(() => {
    // For every filter applied by our fields (by providing filter function), apply the filter to the rows state
    // filterdFunctions is an object, where key is the field, and value is the function to be applied.
    const filteredRows = Object.values(filterFunctions).reduce(
      (accumulatedRows, currentFilter) => {
        return accumulatedRows.filter(currentFilter); // same as rows.filter((row) => some filter condition)
      },
      [...rows]
    );
    setRows(filteredRows); // set state using rows with all filters applied
  }, [filterFunctions]);

  // Make api request to get rows for the selected table.
  const getRows = async (table_name) => {
    const apiUrl = `${serverUrl}/api/get-table?table_name=${table_name}`;
    const json = await getJson(apiUrl); // If request failed, getJson returns null
    setRows(json ? json : [{ rows }]); // update the rows state
  };

  // Make api request to get fields from the selected table.
  const getFields = async (table_name) => {
    const apiUrl = `${serverUrl}/api/table-fields?table_name=${table_name}`;
    const json = await getJson(apiUrl);
    if (json) {
      setFields(json); //update the fields state
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
    // Make sure column name does not already exist
    if (
      fields.some(
        (field) =>
          field.column_name.toLowerCase() === newFieldName.toLowerCase()
      )
    ) {
      console.log("Column name already exists !");
      return;
    }
    const apiUrl = `${serverUrl}/api/add-column`;
    const json = {
      tableName: selectedTable.table_name,
      columnName: newFieldName.toLocaleLowerCase(),
      dataType,
    };
    const response = await Post(apiUrl, json); //requests api endpoint to alter table.
    if (response) {
      //
      setNewFieldName("");
      getFields(selectedTable.table_name);
    } else {
      console.log("Failed to add new column ");
    }
  };

  // For checkbox data types, alter the table depending on the checkbox values for the specific checkbox field/column
  const addCheckboxFilter = async (filter, field) => {
    await getRows(selectedTable.table_name); // wait for rows to be refreshed. Need this so filters can change/reapply properly
    switch (filter) {
      // if we unapply the filter, remove it from filters object, retrieve fresh unaltered rows, then apply the remaining filters
      case "none": {
        const removedFilter = { ...filterFunctions }; // copy the object
        delete removedFilter[field]; // remove the key value pair for the specific field
        // await getRows(selectedTable.table_name); // wait for rows to be refreshed
        setFilterFunctions(removedFilter); // Set new state without the filter
        break;
      }
      case "true": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === true, // key value to add. replaces old filter for the field if exists
        });
        break;
      }
      case "false": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === false, // key value to add. replaces old filter for the field if exists
        });
        break;
      }
      default: {
        break; ///uhhh what do you want me to do, i did not account for this...
      }
    }
  };

  const addRatingFilter = async (filter, field) => {
    await getRows(selectedTable.table_name);
    switch (filter) {
      case "none": {
        const removedFilter = { ...filterFunctions };
        delete removedFilter[field];
        setFilterFunctions(removedFilter);
        break;
      }
      case "☆": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === "☆",
        });
        break;
      }
      case "⭐️": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === "⭐️",
        });
        break;
      }
      case "⭐️⭐️": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === "⭐️⭐️",
        });
        break;
      }
      case "⭐️⭐️⭐️": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === "⭐️⭐️⭐️",
        });
        break;
      }
      case "⭐️⭐️⭐️⭐️": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === "⭐️⭐️⭐️⭐️",
        });
        break;
      }
      case "⭐️⭐️⭐️⭐️⭐️": {
        setFilterFunctions({
          ...filterFunctions,
          [field]: (row) => row[field] === "⭐️⭐️⭐️⭐️⭐️",
        });
        break;
      }
      default: {
        break;
      }
    }
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
        Add Column:
      </button>
      <input // allow user to input new field name
        id="new-field-name-input"
        value={newFieldName}
        placeholder="Enter Column Name"
        onChange={(e) => {
          setNewFieldName(e.target.value);
        }}
      ></input>
      <select
        id="data-type"
        onChange={(e) => {
          setDataType(e.target.value);
        }}
      >
        <option value={"VARCHAR"}>Rating</option>
        <option value={"TEXT"}>Text Block</option>
        <option value={"INT"}>Number</option>
        <option value={"MONEY"}>Money</option>
        <option value={"BOOL"}>CheckBox</option>
        <option value={"DATE"}>Date</option>
        <option value={"TIME"}>Time</option>
        {/* <option value={"JSON"}>JSON</option> */}
      </select>
      <button
        className="top-table-button"
        onClick={() => {
          getRows(selectedTable.table_name);
          setFilterFunctions({});
        }}
      >
        undo filters
      </button>
      <table style={{ backgroundColor: selectedTable.table_color }}>
        {/*make every key in our table a header*/}
        {fields.map((field_data, index) => {
          return (
            <th>
              <input
                type="text"
                value={field_data.column_name}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index] = e.target.value;
                  setFields(newFields);
                }}
                onBlur={(e) => {}}
              ></input>
              {/* <p onBlur={(e) => {}}>{field_data.column_name}</p> */}
              {field_data.data_type === "boolean" && (
                <select
                  id="checkbox-filter"
                  onChange={async (e) =>
                    await addCheckboxFilter(
                      e.target.value,
                      field_data.column_name
                    )
                  }
                >
                  <option value="none">-</option>
                  <option value="true">checked</option>
                  <option value="false">unchecked</option>
                </select>
              )}
              {field_data.data_type === "character varying" && (
                <div>
                  <select
                    id="rating-filter"
                    onChange={async (e) =>
                      await addRatingFilter(
                        e.target.value,
                        field_data.column_name
                      )
                    }
                  >
                    <option value="none">-</option>
                    <option value="☆">☆</option>
                    <option value="⭐️">⭐️</option>
                    <option value="⭐️⭐️">⭐️⭐️</option>
                    <option value="⭐️⭐️⭐️">⭐️⭐️⭐️</option>
                    <option value="⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️</option>
                    <option value="⭐️⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️⭐️</option>
                  </select>
                </div>
              )}
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
                    <InputBox
                      recordIndex={recordIndex}
                      field_data={field_data}
                      selectedTable={selectedTable}
                      record={record}
                      rows={rows}
                      setRows={setRows}
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
