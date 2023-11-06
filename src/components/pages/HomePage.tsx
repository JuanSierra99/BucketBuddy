import { useEffect, useState } from "react";
import React from "react";
import Table from "../molecules/Table";
import { getJson, Post } from "../../../Backend/Requests";

const url = "http://localhost:3000";

// Component that gives dropdown of all tables
const Selector = (props) => {
  const data = props.data;
  return (
    <div className="scrollable-div">
      {data.map((name) => {
        return (
          <button
            className="tableNameButton"
            value={name}
            onClick={(e) => {
              props.setState(e.target.value);
            }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export function HomePage() {

  const [selectedTable, setSelectedTable] = useState("");
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");

  const getTables = async () => {
    const url = "http://localhost:3000/api/all-tables";
    const json = await getJson(url);
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
        <Selector setState={setSelectedTable} data={tables} />
      </div>
      <div className="rightbar">
        <input
          type="text"
          id="createTableName"
          placeholder="Enter new table name"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <button
          onClick={async () => {
            const url = "http://localhost:3000/api/new-table";
            const json = { name: newTableName };
            await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
            await getTables(); //will request api endpoint to send current tables in db, then updates tables state
          }}
        >
          Create new table
        </button>
        <button
          onClick={async () => {
            const url = "http://localhost:3000/api/add-row";
            const json = { tableName: selectedTable };
            await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
          }}
        >
          Add Row
        </button>
        <p className="databaseStatus">Database status</p>
        <Table selectedTable={selectedTable}/>
      </div>
    </div>
  );
}
