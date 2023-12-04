import React, { useState } from "react";
import "./ScrollableListSelector.css";
// This component displays a scrollable list of table names.
// It sets the state of the selected table based on user interaction with the list.
// Additionally, it includes search functionality to filter the displayed tables.
export const ScrollableListSelector = (props) => {
  const { data, searchTableName, setSelectedTable, buddyImage } = props;
  const [lastSelected, setLastSelected] = useState(null);

  return (
    <div className="scrollable-div">
      {data.map((table) => {
        // console.log("in ScrollableListSelector", table);
        // Only show table buttons that contains string input in search bar
        if (
          table.table_name.toLowerCase().includes(searchTableName.toLowerCase())
        ) {
          return (
            <button
              style={{ color: table.table_color }}
              key={table.table_name} // Each item in a list should have a unique key prop (React wants this for optimized renders)
              className="tableNameButton"
              onClick={(e) => {
                setSelectedTable(table);
                setLastSelected(table.table_name);
              }}
            >
              {table.table_name}
              {lastSelected === table.table_name && ( // if last selected table is name of currently selected table. SHOW THE DOG !!!
                <img src={buddyImage} className="button-buddy-image" />
              )}
            </button>
          );
        }
      })}
    </div>
  );
};
