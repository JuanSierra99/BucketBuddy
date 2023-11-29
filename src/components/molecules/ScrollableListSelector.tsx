import React, { useState } from "react";
import "./ScrollableListSelector.css";
// This component displays a scrollable list of table names.
// It sets the state of the selected table based on user interaction with the list.
// Additionally, it includes search functionality to filter the displayed tables.
export const ScrollableListSelector = (props) => {
  const [lastSelected, setLastSelected] = useState(null);
  const [searchTableName, setSearchTableName] = useState("");
  return (
    <div className="scrollable-div">
      <input
        className="search-bar"
        type="text"
        id="searchForTable"
        placeholder="Search"
        value={searchTableName}
        onChange={(e) => setSearchTableName(e.target.value)}
      />
      {props.data.map((table) => {
        // Only show table buttons that contains string input in search bar
        if (
          table.table_name
            .toLowerCase()
            .includes(searchTableName.toLocaleLowerCase())
        ) {
          return (
            <button
              style={{ color: table.table_color }}
              key={table.table_name} // Each item in a list should have a unique key prop (React wants this for optimized renders)
              className="tableNameButton"
              onClick={(e) => {
                props.setState(table);
                setLastSelected(table.table_name);
              }}
            >
              {table.table_name}
              {lastSelected === table.table_name && ( // if last selected table is name of currently selected table. SHOW THE DOG !!!
                <img src="/button-buddy.PNG" className="button-buddy-image" />
              )}
            </button>
          );
        }
      })}
    </div>
  );
};
