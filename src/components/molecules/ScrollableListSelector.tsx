import React, {useState} from "react";
import "./ScrollableListSelector.css";
// This component displays a scrollable list of table names.
// It sets the state of the selected table based on user interaction with the list.
// Additionally, it includes search functionality to filter the displayed tables.
export const ScrollableListSelector = (props) => {
    const data = props.data;
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
        {data.map((name) => {
          // Only return tables that contains value in search bar
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
                  {lastSelected === name && ( // if last selected table is name of currently selected table. SHOW THE DOG !!!
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
  