import { useEffect, useState } from "react";
import React from "react";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import { InputBox } from "../atoms/InputBox";
import { SearchBar } from "./SearchBar";
import AddColumnModal from "../atoms/AddColumnModal";
import { FilterSelection } from "../atoms/FilterSelection";
import "./Table.css";

// selectedTable is in the form of {table_name: string, table_color: string }
export default function Table({ selectedTable }) {
  // Data for selected table
  const [rows, setRows] = useState([{}]); // The row data for the selected table
  const [fields, setFields] = useState([]); // An object representing table fields. Has a name, and data type
  const [filterFunctions, setFilterFunctions] = useState({}); // Holds key value pairs, where key is field/column name, and filter function to be applied to rows is the value
  const [searchTable, setSearchTable] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Get the data (rows and fields) for the table, and continue to do so whenever a new table is selected
  useEffect(() => {
    const table_name = selectedTable.table_name;
    setShowModal((prevstate) => prevstate && !prevstate); // dont want it to stay showing when switching tables
    if (table_name) {
      getRows(table_name); // get tables rows
      getFields(table_name); // get tables fields
      setFilterFunctions([]); // unapply all filters when switching tables
    }
  }, [selectedTable.table_name]);

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

  const changeField = (tableName, currentFieldName, newFieldName) => {
    const apiUrl = `${serverUrl}/api/change-field`;
    const json = { tableName, currentFieldName, newFieldName };
    Post(apiUrl, json);
  };

  return (
    <div>
      <SearchBar value={searchTable} setValue={setSearchTable}></SearchBar>
      <button className="top-table-button" onClick={addRow}>
        New Entry
      </button>
      <button
        className="top-table-button"
        onClick={() => setShowModal((prevState) => !prevState)}
      >
        Add Column
      </button>
      {showModal && (
        <AddColumnModal
          fields={fields}
          selectedTable={selectedTable}
          getFields={getFields}
          setShowModal={setShowModal}
        />
      )}

      <button
        className="top-table-button"
        onClick={() => {
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
              {/* <input
                type="text"
                value={field_data.column_name}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index] = e.target.value;
                  setFields(newFields);
                }}
                onBlur={(e) => {}}
              ></input> */}

              <p onBlur={(e) => {}}>{field_data.column_name}</p>
              {field_data.data_type === "boolean" && (
                <FilterSelection
                  filterFunctions={filterFunctions}
                  setFilterFunctions={setFilterFunctions}
                  field_data={field_data}
                />
              )}
              {field_data.data_type === "character varying" && (
                <FilterSelection
                  filterFunctions={filterFunctions}
                  setFilterFunctions={setFilterFunctions}
                  field_data={field_data}
                />
              )}
            </th>
          );
        })}
        {/*for every object in our data set*/}
        {rows.map((record, recordIndex) => {
          // console.log(record)
          // Search bar filtering, and column filtering
          if (
            (searchTable === "" ||
              Object.values(record)
                .toString()
                .toLowerCase()
                .includes(searchTable.toLowerCase())) &&
            Object.entries(filterFunctions).every(([field, condition]) => {
              return record[field].toString() === condition.toString();
            })
          )
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
      </table>
      <button className="bottom-row-plus-button" onClick={addRow}>
        + Row
      </button>
    </div>
  );
}
