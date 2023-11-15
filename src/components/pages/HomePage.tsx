import React, { useEffect, useState } from "react";
import Table from "../molecules/Table";
import { ScrollableListSelector } from "../molecules/ScrollableListSelector";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import { NavBar } from "../molecules/NavBar";

export function HomePage() {
  const [selectedTable, setSelectedTable] = useState("");
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");

  const getTables = async () => {
    const apiUrl = `${serverUrl}/api/all-tables`;
    const json = await getJson(apiUrl);
    setTables(json.table_names);
    return json.table_names;
  };
  //retrieve a list of all the tables in our database
  //maybe we can use this to prevent users from trying to create a duplicate table with api create table endpoint
  useEffect(() => {
    getTables().then((res) => {
      setSelectedTable(res[0]);
    });
  }, []); //maybe we want to do something with this when we add new tables ?

  return (
    <div className="homepage">
      <div className="sidebar">
      <input
          type="text"
          id="createTableName"
          placeholder="Enter new table name"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <button
          onClick={async () => {
            const apiUrl = `${serverUrl}/api/new-table`;
            const json = { table_name: newTableName };
            await Post(apiUrl, json); //requests api endpoint to create new table. must await for getTables() to have updated info
            await getTables(); //will request api endpoint to send current tables in db, then updates tables state
          }}
        >
          Create new table
        </button>
        <ScrollableListSelector setState={setSelectedTable} data={tables} />
      </div>
      <div className="rightbar">
        <Table selectedTable={selectedTable} />
         <p className="databaseStatus">Database status</p>
      </div>
    </div>
  );
}
