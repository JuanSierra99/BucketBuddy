import React, { useEffect, useState } from "react";
import { ScrollableListSelector } from "../molecules/ScrollableListSelector";
import { serverUrl } from "../../config";
import { Post } from "../../../Backend/Requests";
import { SearchBar } from "../molecules/SearchBar";
import "./Sidebar.css";

//Component for our homepages sidebar. Has functionality for searching tables, creating tables, and displayoing/selecting tables
export const Sidebar = (props) => {
  const {
    newTableName,
    setNewTableName,
    setTableColor,
    tableColor,
    Post,
    getTables,
    selectedTable,
    setSelectedTable,
    tables,
    buddyImage,
    setBuddyImage,
  } = props;

  const [searchTableName, setSearchTableName] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="sidebar" id="sidebar">
      <div className="create-table-container">
        <input
          className="create-table-input"
          type="text"
          id="create-table-input"
          placeholder="new table name"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <label htmlFor="create-table-color">{/* Color */}</label>
        <div className="color-container">
          <input
            className="create-table-color"
            id="create-table-color"
            type="color"
            onChange={(e) => {
              setTableColor(e.target.value);
            }}
          ></input>
          <div className="color-dots">
            <p style={{ color: "#ff0831" }}> &#8226;</p>
            <p style={{ color: "#e5009d" }}> &#8226;</p>
            <p style={{ color: "#e90eff" }}> &#8226;</p>
            <p style={{ color: "#9203e8" }}> &#8226;</p>
            <p style={{ color: "#6100ff" }}> &#8226;</p>
          </div>
        </div>

        <button
          style={{ backgroundColor: tableColor }}
          id="create-table-button"
          className="create-table-button"
          onClick={async () => {
            try {
              //Make sure we do not allow duplicate table names.
              const noDuplicateName = tables.every((table_object) => {
                return (
                  table_object.table_name.trim().toLowerCase() !=
                  newTableName.trim().toLowerCase()
                );
              });
              if (noDuplicateName) {
                const apiUrl = `${serverUrl}/api/new-table`;
                const json = {
                  table_name: newTableName.trim(), //No leading/trailing whitespaces
                  table_color: tableColor,
                };
                const PostResponse = await Post(apiUrl, json); //requests api endpoint to create new table. must await for getTables() to have updated info
                if (PostResponse) {
                  //Clear user input field if success
                  setNewTableName("");
                }
                await getTables(); //will request api endpoint to send current tables in db, then updates tables state
              } else {
                return console.log("No duplicate table names allowed");
              }
            } catch (error) {
              console.error("Error creating table:", error);
            }
          }}
        >
          Create new table
        </button>
      </div>
      <SearchBar
        value={searchTableName}
        setValue={setSearchTableName}
      ></SearchBar>
      <ScrollableListSelector
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        data={tables}
        searchTableName={searchTableName}
        buddyImage={buddyImage}
      />
      {showModal && (
        <div className="settings-modal">
          <button
            onClick={async () => {
              const apiUrl = `${serverUrl}/api/change-buddy-image-setting`;
              const json = {
                image_url: "./buddy_images/hanging_spot.webp",
              };
              await Post(apiUrl, json);
              setBuddyImage("./buddy_images/hanging_spot.webp");
            }}
          >
            <img src="./buddy_images/spot.webp"></img>
          </button>
          <button
            onClick={async () => {
              const apiUrl = `${serverUrl}/api/change-buddy-image-setting`;
              const json = {
                image_url: "./buddy_images/hanging_bern.webp",
              };
              await Post(apiUrl, json);
              setBuddyImage("./buddy_images/hanging_bern.webp");
            }}
          >
            <img src="./buddy_images/Bernese.webp"></img>
          </button>
          <button
            onClick={async () => {
              const apiUrl = `${serverUrl}/api/change-buddy-image-setting`;
              const json = {
                image_url: "./buddy_images/button-buddy.webp",
              };
              await Post(apiUrl, json);
              setBuddyImage("./buddy_images/button-buddy.webp");
            }}
          >
            <img src="./buddy_images/buddy.webp"></img>
          </button>
        </div>
      )}

      <button
        className="settings-button"
        onClick={() => {
          setShowModal((prevstate) => !prevstate);
        }}
      >
        <img src="./gear-solid.svg"></img>
      </button>
    </div>
  );
};
