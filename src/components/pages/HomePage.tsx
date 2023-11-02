import { useEffect, useState } from "react";
import React from "react";
import Table from "../molecules/Table";

const url = "http://localhost:3000";

const getJson = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    console.log(response.status + " " + response.statusText);
    const json = await response.json();
    return json;
  } else {
    console.log("Error: " + response.status + " " + response.statusText);
  }
};

const Post = async (url, json) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
  if (response.ok) {
    console.log(response.status + " " + response.statusText);
    const json = await response.json();
    return json;
  } else {
    console.log("Error: " + response.status + " " + response.statusText);
  }
};

// Component that gives dropdown of all tables 
const Selector = (props) => {
  const data = props.data
  return (
    <select
      onChange={(e) => {
        props.setState(e.target.value);
      }}
    >
      {data.map((name) => {
        return <option value={name}>{name}</option>;
      })}
    </select>
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
    return json.table_names
  };
  //retrieve a list of all the tables in our database
  //maybe we can use this to prevent users from trying to create a duplicate table with api create table endpoint
  useEffect(() => {
     getTables().then((res) => {setSelectedTable(res[0])});
  }, []); //maybe we want to do something with this when we add new tables ?

  return (
    <div>
      <Selector setState={setSelectedTable} data={tables}/>
      <input
        type="text"
        id="createTableName"
        placeholder="Enter new table name"
        value={newTableName}
        onChange={(e) => setNewTableName(e.target.value)}
      />
      <button
        onClick={async () => {
          const url = "http://localhost:3000/api/new-table"
          const json = { name: newTableName }
          await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
          await getTables(); //will request api endpoint to send current tables in db, then updates tables state
        }}
      >
        Create new table
      </button>
      <button
        onClick={async () => {
          const url = "http://localhost:3000/api/add-row"
          const json = { tableName: "movies" }
          await Post(url, json); //requests api endpoint to create new table. must await for getTables() to have updated info
        }}
      >
        Add Row
      </button>
      <Table selectedTable={selectedTable} />
    </div>
  );
}
