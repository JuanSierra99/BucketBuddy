import React, { useState } from "react";
import { ScrollableListSelector } from "../molecules/ScrollableListSelector";
import { serverUrl } from "../../config";
import "./Sidebar.css";

//Component for our homepages sidebar. Has functionality for searching tables, creating tables, and displayoing/selecting tables
export const Sidebar = (props) => {
  const {
    newTableName,
    setNewTableName,
    setTableColor,
    tableColor,
    Post,
    getTables,
    setSelectedTable,
    tables,
  } = props;
  const [searchTableName, setSearchTableName] = useState("");
  return (
    <div className="sidebar" id="sidebar">
      <div className="create-table-container">
        <input
          className="create-table-input"
          type="text"
          id="create-table-input"
          placeholder="new table name"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <label htmlFor="create-table-color">{/* Color */}</label>
        <div className="color-container">
          <input
            className="create-table-color"
            id="create-table-color"
            type="color"
            onChange={(e) => {
              setTableColor(e.target.value);
            }}
          ></input>
          <div className="color-dots">
            <p style={{ color: "#ff0831" }}> &#8226;</p>
            <p style={{ color: "#e5009d" }}> &#8226;</p>
            <p style={{ color: "#e90eff" }}> &#8226;</p>
            <p style={{ color: "#9203e8" }}> &#8226;</p>
            <p style={{ color: "#6100ff" }}> &#8226;</p>
          </div>
        </div>

        <button
          style={{ backgroundColor: tableColor }}
          id="create-table-button"
          className="create-table-button"
          onClick={async () => {
            try {
              const apiUrl = `${serverUrl}/api/new-table`;
              const json = {
                table_name: newTableName,
                table_color: tableColor,
              };
              const PostResponse = await Post(apiUrl, json); //requests api endpoint to create new table. must await for getTables() to have updated info
              if (PostResponse) {
                //Clear user input field if success
                setNewTableName("");
              }
              await getTables(); //will request api endpoint to send current tables in db, then updates tables state
            } catch (error) {
              console.error("Error creating table:", error);
            }
          }}
        >
          Create new table
        </button>
      </div>
      <div className="search-bar">
        <img src="./search.svg"></img>
        <input
          className="search-input"
          type="search"
          id="searchForTable"
          placeholder="Search"
          value={searchTableName}
          onChange={(e) => setSearchTableName(e.target.value)}
        />
      </div>
      <ScrollableListSelector
        setState={setSelectedTable}
        data={tables}
        searchTableName={searchTableName}
      />
      <button className="settings-button">
        <img src="/public/gear-solid.svg"></img>
      </button>
    </div>
  );
};
