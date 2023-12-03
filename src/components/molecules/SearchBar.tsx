import React from "react";
import "./SearchBar.css";
export const SearchBar = (props) => {
  return (
    <div className="search-bar">
      <img src="./search.svg"></img>
      <input
        className="search-input"
        type="search"
        id="searchForTable"
        placeholder="Search"
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
      />
    </div>
  );
};
