import React, { useEffect, useState } from "react";
import Table from "../molecules/Table";
import { Sidebar } from "../organisms/Sidebar";
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
  const [buddyImage, setBuddyImage] = useState("/button-buddy.PNG");

  const getTables = async () => {
    const apiUrl = `${serverUrl}/api/all-tables`;
    const json = await getJson(apiUrl);
    setTables(json.table_data); // set state with the obtained table names
    return json.table_data;
  };

  const getSettings = async () => {
    const apiUrl = `${serverUrl}/api/get-settings`;
    const json = await getJson(apiUrl);
    setBuddyImage(json.settings.image);
    return json.settings;
  };

  //retrieve a list of all the tables in our database
  //maybe we can use this to prevent users from trying to create a duplicate table with api create table endpoint
  useEffect(() => {
    getSettings();
    getTables().then((res) => {
      if (res.length > 0) {
        setSelectedTable(res[0]);
      }
    });
  }, []); //maybe we want to do something with this when we add new tables ?

  return (
    <div className="homepage">
      <NavBar></NavBar>
      <Sidebar
        newTableName={newTableName}
        setNewTableName={setNewTableName}
        setTableColor={setTableColor}
        tableColor={tableColor}
        Post={Post}
        getTables={getTables}
        setSelectedTable={setSelectedTable}
        tables={tables}
        buddyImage={buddyImage}
        setBuddyImage={setBuddyImage}
      ></Sidebar>
      <div
        className={`table-section ${
          !isSidebarVisible && "table-section-no-sidebar"
        }`}
      >
        <button
          onClick={toggleSideBarVisibility}
          className={`sidebar-toggle ${isSidebarVisible && "sidebar-hidden"}`}
        >
          +
        </button>
        {tables.length > 0 && (
          <div className="table-container">
            <p
              style={{ color: selectedTable.table_color }}
              className="tableName"
            >
              {selectedTable.table_name}
              <button
                className="delete-table-button"
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
                <img src="circle-xmark-regular.svg"></img>
              </button>
            </p>
            <Table selectedTable={selectedTable} />
          </div>
        )}
        <p className="databaseStatus">Database status</p>
      </div>
    </div>
  );
}
