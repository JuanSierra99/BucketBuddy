import { useState, useEffect } from "react";
import { Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import "./AddColumnModal.css";
const AddColumnModal = (props) => {
  const { fields, selectedTable, getFields, setShowModal } = props;
  const [newFieldName, setNewFieldName] = useState("");
  const [dataType, setDataType] = useState("Text"); // Used for creating new columns. changes when user wants to select a different data type.
  // Make a Post request to add a new field/column to the table. Refreshes table to show new column

  useEffect(() => {
    setNewFieldName("");
    setDataType("TEXT");
  }, []); // Run only once on component mount

  const addField = async () => {
    // Make sure column name does not already exist
    if (
      fields.some(
        (field) =>
          field.column_name.trim().toLowerCase() ===
          newFieldName.trim().toLowerCase()
      )
    ) {
      console.log("Column name already exists !");
      return;
    }
    const apiUrl = `${serverUrl}/api/add-column`;
    const json = {
      tableName: selectedTable.table_name,
      columnName: newFieldName.trim().toLocaleLowerCase(),
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

  return (
    <div className="modal-container">
      <input // allow user to input new field name
        className="column-name-input"
        id="new-field-name-input"
        value={newFieldName}
        placeholder="Enter Column Name"
        onChange={(e) => {
          setNewFieldName(e.target.value);
        }}
      ></input>
      <div className="select-container">
        <p className="type-text">Type:</p>
        <select
          className="data-type-select"
          id="data-type"
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value);
          }}
        >
          <option value={"TEXT"}>Text</option>
          <option value={"INT"}>Number</option>
          <option value={"BOOL"}>CheckBox</option>
          <option value={"VARCHAR"}>Rating</option>
          <option value={"MONEY"}>Money</option>
          <option value={"DATE"}>Date</option>
          <option value={"TIME"}>Time</option>
          {/* <option value={"JSON"}>JSON</option> */}
        </select>
      </div>

      <button
        className="done-button"
        onClick={() => {
          setShowModal(false);
          if (newFieldName) {
            addField();
          }
        }}
      >
        Done
      </button>
    </div>
  );
};

export default AddColumnModal;
