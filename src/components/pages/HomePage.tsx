import React, { useEffect, useState } from "react";
import Table from "../molecules/Table";
import { ScrollableListSelector } from "../molecules/ScrollableListSelector";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import "./HomePage.css";
import { NavBar } from "../molecules/NavBar";

export function HomePage() {
  // Function to toggle the sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSideBarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  // For the table user currently has selected
  const [selectedTable, setSelectedTable] = useState({
    table_name: "",
    table_color: "",
  });
  // All the tables for the user. updated to Array of objects.
  const [tables, setTables] = useState([]);
  // The current value in create table input box, for when user wants to create table.
  const [newTableName, setNewTableName] = useState("");
  // For user to assign a table color when creating new table. default color is white
  const [tableColor, setTableColor] = useState("rgb(100,100,210)");

  const getTables = async () => {
    const apiUrl = `${serverUrl}/api/all-tables`;
    const json = await getJson(apiUrl);
    setTables(json.table_data); // set state with the obtained table names
    return json.table_data;
  };
  //retrieve a list of all the tables in our database
  //maybe we can use this to prevent users from trying to create a duplicate table with api create table endpoint
  useEffect(() => {
    getTables().then((res) => {
      if (res.length > 0) {
        setSelectedTable(res[0]);
      }
    });
  }, []); //maybe we want to do something with this when we add new tables ?

  return (
    <div className="homepage">
      <NavBar></NavBar>
      <div className={"sidebar"} id="sidebar">
        <div className="create-table-container">
          <input
            className="create-table-input"
            type="text"
            id="create-table-input"
            placeholder="new table name"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <input
            className="create-table-color"
            id="create-table-color"
            type="color"
            onChange={(e) => {
              setTableColor(e.target.value);
            }}
          ></input>
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
                await Post(apiUrl, json); //requests api endpoint to create new table. must await for getTables() to have updated info
                await getTables(); //will request api endpoint to send current tables in db, then updates tables state
              } catch (error) {
                console.error("Error creating table:", error);
              }
            }}
          >
            Create new table
          </button>
        </div>
        <ScrollableListSelector setState={setSelectedTable} data={tables} />
      </div>
      <div
        className={`table-section ${
          !isSidebarVisible && "table-section-no-sidebar"
        }`}
      >
        <button
          onClick={toggleSideBarVisibility}
          className={`sidebar-toggle ${isSidebarVisible && "sidebar-hidden"}`}
        >
          =
        </button>
        <Table selectedTable={selectedTable} />
        <button
          style={{
            backgroundColor: "red",
            fontWeight: "bold",
            fontSize: "16px",
          }}
          onClick={async () => {
            const apiUrl = `${serverUrl}/api/deleteTable`;
            const json = {
              table_name: selectedTable.table_name,
            };
            await Post(apiUrl, json);
            await getTables();
            tables[0] && setSelectedTable(tables[0]);
          }}
        >
          x
        </button>
        <p className="databaseStatus">Database status</p>
      </div>
    </div>
  );
}
