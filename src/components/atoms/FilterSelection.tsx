import React from "react";

export const FilterSelection = (props) => {
  const { filterFunctions, setFilterFunctions, field_data } = props;
  // For checkbox data types, alter the table depending on the checkbox values for the specific checkbox field/column

  const addCheckboxFilter = async (filter, field) => {
    switch (filter) {
      // if we unapply the filter, remove it from filters object, retrieve fresh unaltered rows, then apply the remaining filters
      case "none": {
        const removedFilter = { ...filterFunctions }; // copy the object
        delete removedFilter[field]; // remove the key value pair for the specific field
        setFilterFunctions(removedFilter); // Set new state without the filter
        break;
      }
      case "true": {
        setFilterFunctions({ ...filterFunctions, [field]: true });
        break;
      }
      case "false": {
        setFilterFunctions({ ...filterFunctions, [field]: false });
        break;
      }
      default: {
        break; ///uhhh what do you want me to do, i did not account for this...
      }
    }
  };

  const addRatingFilter = async (filter, field) => {
    switch (filter) {
      case "none": {
        const removedFilter = { ...filterFunctions };
        delete removedFilter[field];
        setFilterFunctions(removedFilter);
        break;
      }
      case "☆": {
        setFilterFunctions({ ...filterFunctions, [field]: "☆" });
        break;
      }
      case "⭐️": {
        setFilterFunctions({ ...filterFunctions, [field]: "⭐️" });
        break;
      }
      case "⭐️⭐️": {
        setFilterFunctions({ ...filterFunctions, [field]: "⭐️⭐️" });
        break;
      }
      case "⭐️⭐️⭐️": {
        setFilterFunctions({ ...filterFunctions, [field]: "⭐️⭐️⭐️" });
        break;
      }
      case "⭐️⭐️⭐️⭐️": {
        setFilterFunctions({ ...filterFunctions, [field]: "⭐️⭐️⭐️⭐️" });
        break;
      }
      case "⭐️⭐️⭐️⭐️⭐️": {
        setFilterFunctions({ ...filterFunctions, [field]: "⭐️⭐️⭐️⭐️⭐️" });
        break;
      }
      default: {
        break;
      }
    }
  };
  return (
    <div>
      {field_data.data_type === "boolean" && (
        <div className="filter-container">
          <img src="./filter-solid.svg"></img>
          <select
            id="checkbox-filter"
            onChange={async (e) =>
              await addCheckboxFilter(e.target.value, field_data.column_name)
            }
          >
            <option value="none">none</option>
            <option value="true">checked</option>
            <option value="false">unchecked</option>
          </select>
        </div>
      )}
      {field_data.data_type === "character varying" && (
        <div className="filter-container">
          <img src="./filter-solid.svg"></img>
          <select
            id="rating-filter"
            onChange={async (e) =>
              await addRatingFilter(e.target.value, field_data.column_name)
            }
          >
            <option value="none">none</option>
            <option value="☆">☆</option>
            <option value="⭐️">⭐️</option>
            <option value="⭐️⭐️">⭐️⭐️</option>
            <option value="⭐️⭐️⭐️">⭐️⭐️⭐️</option>
            <option value="⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️</option>
            <option value="⭐️⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️⭐️</option>
          </select>
        </div>
      )}
    </div>
  );
};
