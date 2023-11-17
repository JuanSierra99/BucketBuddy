import React, { useEffect, useState } from "react";
import Table from "../molecules/Table";
import { ScrollableListSelector } from "../molecules/ScrollableListSelector";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import "./HomePage.css";
import { NavBar } from "../molecules/NavBar";

export function HomePage() {
  const [selectedTable, setSelectedTable] = useState("");
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");
  const [tableColor, setTableColor] = useState("orange");

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
        setSelectedTable(res[0].table_name);
      }
    });
  }, []); //maybe we want to do something with this when we add new tables ?

  return (
    <div className="homepage">
      <NavBar></NavBar>
      <div className="sidebar">
        <div className="create-table-container">
          <input
            className="create-table-input"
            type="text"
            id="createTableName"
            placeholder="new table name"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <button
            className="create-table-button"
            onClick={async () => {
              const apiUrl = `${serverUrl}/api/new-table`;
              const json = {
                table_name: newTableName,
                table_color: tableColor,
              };
              await Post(apiUrl, json); //requests api endpoint to create new table. must await for getTables() to have updated info
              await getTables(); //will request api endpoint to send current tables in db, then updates tables state
            }}
          >
            Create new table
          </button>
        </div>
        <ScrollableListSelector setState={setSelectedTable} data={tables} />
      </div>
      <div className="table-section">
        <input
          type="color"
          onChange={(e) => {
            setTableColor(e.target.value);
          }}
        ></input>
        <button
          onClick={async () => {
            const apiUrl = `${serverUrl}/api/deleteTable`;
            const json = { table_name: selectedTable, table_color: tableColor };
            await Post(apiUrl, json);
            getTables();
          }}
        >
          Delete table
        </button>
        <Table selectedTable={selectedTable} />
        <p className="databaseStatus">Database status</p>
      </div>
    </div>
  );
}
