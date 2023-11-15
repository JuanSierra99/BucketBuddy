import { useEffect, useState } from "react";
import React from "react";
import Table from "../molecules/Table";
import { getJson, Post } from "../../../Backend/Requests";
import { serverUrl } from "../../config";
import { NavBar } from "../molecules/NavBar";

// Component that gives dropdown of all tables
const Selector = (props) => {
  const data = props.data;
  const [lastSelected, setLastSelected] = useState(null);
  const [searchTableName, setSearchTableName] = useState("");
  return (
    <div className="scrollable-div">
      <input
        type="text"
        id="searchForTable"
        placeholder="Search"
        value={searchTableName}
        onChange={(e) => setSearchTableName(e.target.value)}
      />
      {data.map((name) => {
        if (name.toLowerCase().includes(searchTableName.toLocaleLowerCase())) {
          return (
            <div>
              <button
                className="tableNameButton"
                value={name}
                onClick={(e) => {
                  props.setState(e.target.value);
                  setLastSelected(name);
                }}
              >
                {name}
                {lastSelected === name && (
                  <img src="/button-buddy.PNG" className="button-buddy-image" />
                )}
              </button>
            </div>
          );
        }
      })}
    </div>
  );
};

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
        <Selector setState={setSelectedTable} data={tables} />
      </div>
      <div className="rightbar">
        <Table selectedTable={selectedTable} />
         <p className="databaseStatus">Database status</p>
      </div>
    </div>
  );
}
