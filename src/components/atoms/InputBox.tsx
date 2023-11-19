import React from "react";
import { serverUrl } from "../../config";
import { Post } from "../../../Backend/Requests";
export const InputBox = ({
  recordIndex,
  field_data,
  selectedTable,
  record,
  rows,
  setRows,
}) => {
  // Update the state of the value in a table cell whenever it is changed.
  // Takes the event object (e), index of the row, and the key (column name) as parameters.
  const handleInputChange = (val, index, key) => {
    const newDataSet = [...rows]; // Create a copy of the current state to avoid direct mutation
    newDataSet[index][key] = val; // Update the value in the specified cell with the new input value
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
  // Mapping from SQL data types to corresponding JavaScript input types for rendering our table cells.
  const sql_to_js_types = {
    "character varying": "text",
    integer: "number",
    boolean: "checkbox",
    date: "date",
    "time without time zone": "Time",
  };
  switch (sql_to_js_types[field_data.data_type]) {
    case "text":
      return (
        <textarea
          rows={1}
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
              e.target.value,
              recordIndex,
              field_data.column_name
            );
          }}
        />
      );
    case "checkbox":
      return (
        <div>
          <input
            type="checkbox"
            name="checker"
            checked={record[field_data.column_name]} // box is checked if true
            // value={record[field_data.column_name]}
            onChange={(e) => {
              handleInputChange(
                e.target.checked,
                recordIndex,
                field_data.column_name
              );
              changeCellValue(
                selectedTable.table_name,
                e.target.checked ? "true" : "false", // has to be sent as string
                record.unique_record_id,
                field_data.column_name
              );
            }}
          />
        </div>
      );
    default:
      return (
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
              e.target.value,
              recordIndex,
              field_data.column_name
            );
          }}
        />
      );
  }
};
{
  /* <InputBox
  recordIndex={recordIndex}
  field_data={field_data}
  selectedTable={selectedTable}
  record={record}
  rows={rows}
  setRows={setRows}
/>; */
}