const client = require("./database");
const express = require("express");
const cors = require("cors");
const passport = require("./passport-config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid"); // For random and unique id's for out table names
const { request } = require("http");
require("dotenv").config();

// Api server framework
const app = express();
// Configure for cross origin requests
app.use(cors());
app.use(express.json()); //Needed to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Needed when we use post in html form

const port = 3000; // Run this api server on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const getTableId = async (username, table_name) => {
  try {
    // Construct a SQL query to select the tableid from user_tables based on the provided username and table_name
    const tableid_query = `SELECT tableid FROM user_tables WHERE username='${username}' AND table_name='${table_name}'`;
    const tableid_result = await client.query(tableid_query); // WHAT HAPPENS IF WE HAVE SAME USER AND TABLE NAMES DUPLICATES ????
    // Check if the query result has no rows or is an empty array
    if (!tableid_result.rows || tableid_result.rows.length === 0) {
      console.log(`Table '${table_name}' not found`);
      // Send an HTTP response indicating that the table was not found
      return;
    }
    // Extract the table_id from the first row of the query result
    const table_id = tableid_result.rows[0].tableid;
    // console.log(table_id);
    return table_id;
  } catch (error) {
    return console.log(error.message);
  }
};

{
  /*Note: psql does not support parameters for identifiers. Ensure proper security practices to prevent sql injection when creating tables,
 or adding new columns*/
}
{
  /*Note: Passport's authentication middleware, when successfully authenticating a user, adds a user object to the request object.  */
}
// Send row data of the specific table
app.get(
  "/api/get-table", // Route
  passport.authenticate("jwt", { session: false }), // protected endpoint. Only authorized users
  async (request, response) => {
    try {
      const table_name = request.query.table_name;
      const username = request.user.username;
      if (!table_name) {
        console.log("Table name is required");
        return response.status(400).json({ Error: "Table name is required" });
      }
      if (!isValidName(table_name)) {
        return response.status(400).json({ Error: "Invalid table name " });
      }
      const table_id = await getTableId(username, table_name);
      const table_query = `SELECT * FROM "${table_id}"`;
      // Execute the SQL query to get the specified table's rows
      const table_result = await client.query(table_query);
      const rows = table_result.rows; // send every row for the requested table
      // Log the data for debugging
      console.log(`Sending rows for ${table_name}: `, rows);
      // Send an HTTP response with data in the response body
      return response.status(200).json(rows);
    } catch (error) {
      console.log("Error @/api/get-table: ", error.message);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// FINISH THIS ONE I MADE IT SUPER QUICK
app.get(
  "/api/table-fields",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    try {
      const table_name = request.query.table_name;
      const username = request.user.username;
      if (!table_name) {
        console.log("table name required");
        return response.status(400).json({ message: "table name required" });
      }
      if (!isValidName(table_name)) {
        console.log("Invalid table name");
        return response.status(400).json({ message: "Invalid table name" });
      }
      const tableId = await getTableId(username, table_name);
      const fields_query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='${tableId}' AND column_name!='unique_record_id'`;
      const fields_result = await client.query(fields_query);
      // const fields = fields_result.rows.map((row) => {
      //   return row.column_name;
      // });
      const fields = fields_result.rows;
      console.log("Sending fields for " + table_name + " table: ", fields);
      return response.status(200).json(fields);
    } catch (error) {
      console.log("@/api/table-fields", error.message);
      return response.status(500).json({ error: error.message });
    }
  }
);

// In the SQL database, create a new table using the speicified name
app.post(
  "/api/new-table",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    try {
      // Get the name of table from the request body
      const tableName = request.body.table_name;
      const username = request.user.username;
      const tableColor = request.body.table_color;
      // Ensure that the given table name is defined
      if (!tableName) {
        console.log("Table name is required");
        return response.status(400).json({ error: "Table name is required" });
      }
      // Ensure that the given table name is valid
      if (!isValidName(tableName)) {
        console.log("Invalid table name");
        return response.status(400).json({ error: "Invalid table name" });
      }
      if (!tableColor) {
        console.log("Invalid table color");
        return response.status(400).json({ error: "Invalid table color" });
      }
      const uniqueId = uuid.v4();
      // Using client class's transaction feature to make sure either both querys execute, or none execute
      // Keep in mind the query's still executes, so order still matters. If one fails, everything is reverted.
      // https://node-postgres.com/features/transactions
      client.query("BEGIN");
      const createTableQuery = `CREATE TABLE "${uniqueId}" (unique_record_id SERIAL PRIMARY KEY , Name VARCHAR)`;
      await client.query(createTableQuery); // Execute the SQL query to create the table
      const update_userTables_query = `INSERT INTO user_tables (tableid, username, table_name, table_color) VALUES ('${uniqueId}', '${username}', '${tableName}', '${tableColor}')`;
      await client.query(update_userTables_query);
      const addEmptyRecordQuery = `INSERT INTO "${uniqueId}" DEFAULT VALUES`;
      await client.query(addEmptyRecordQuery);
      await client.query("COMMIT");
      console.log(`Table "${tableName}" created successfully`); // Log success message
      // Send an HTTP response with a success message in the response body
      return response
        .status(200)
        .json({ message: `Table "${tableName}" created successfully` });
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("@/api/table_fields", error.message);
      return response.status(500).json({ error: "Table creation failed" });
    }
  }
);

// Can a client manipulate table name and user name to drop someone elses table ?!?!?!
app.post(
  "/api/deleteTable",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    try {
      const tableName = request.body.table_name; // Get the table name to delete from the request body
      const username = request.user.username;
      await client.query("BEGIN");
      // ITS VERY IMPORTANT THAT THIS QUERY GOES FIRST. IF NOT, WHEN WE TRY getTableId(), the row in user_tables it needs is already deleted and itll show it does not exitst ! ...
      // ...Because of the other query deleting it
      const tableId = await getTableId(username, tableName); // Get the name of the table in the database
      await client.query(`DROP TABLE "${tableId}"`);
      const deleteUserTableEntryQuery = `DELETE FROM user_tables WHERE table_name='${tableName}' AND username='${username}'`;
      await client.query(deleteUserTableEntryQuery);
      await client.query("COMMIT");
      console.log(`Table "${tableName}" deleted successfully`); // Log success message
      // Send an HTTP response with a success message in the response body
      return response
        .status(200)
        .json({ message: `Table "${tableName}" deleted successfully` });
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("@/api/deleteTable", error.message);
      return response.status(500).json({ error: "table deletion failed" });
    }
  }
);

// Double check validation for this one. Wrote this one kinda fast so make sure it looks good !!!!!!!!!
// In the SQL database, create a new table using the speicified name
app.post(
  "/api/change-cell",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    try {
      const username = request.user.username;
      // Get the table name from the request body
      const tableName = request.body.name;
      // Get the row id from the request body
      const rowId = request.body.rowId;
      // Get the field name from the request body
      const fieldName = request.body.fieldName;
      // Get the new value to assing to cell from the request body
      const newCellValue = request.body.newCellValue;
      // Ensure that the given table name is defined
      if (!tableName) {
        console.log("Table name is required");
        return response.status(400).json({ error: "Table name is required" });
      }
      if (!rowId) {
        console.log("Row Id is required");
        return response.status(400).json({ error: "Row Id is required" });
      }
      if (!fieldName) {
        console.log("Field name is required");
        return response.status(400).json({ error: "Field name is required" });
      }

      if (!newCellValue) {
        console.log("New cell value is required");
        return response
          .status(400)
          .json({ error: "New cell value is required" });
      }
      // Validate all recieved parameters
      if (
        !isValidName(tableName) ||
        !isValidName(rowId) ||
        !isValidName(fieldName)
        // !isValidName(newCellValue) // WE CANT RESTRICT CELL VALUE TOO MUCH !!
      ) {
        console.log("Invalid Parameter");
        return response.status(400).json({ error: "Invalid Parameter" });
      }
      const tableId = await getTableId(username, tableName); // Get actual name of table (each table has a unique id for its name)
      const changeCellQuery = `UPDATE "${tableId}" SET "${fieldName}" = '${newCellValue}' WHERE unique_record_id=${rowId}`;
      // Execute the SQL query to create the table
      await client.query(changeCellQuery);
      // Log a success message indicating that the table has been created.
      console.log(
        `Changed cell in table "${tableName}", with row id ${rowId}, and field name "${fieldName}", to ${newCellValue}`
      );
      // Send an HTTP response with a success message in the response body
      return response.status(200).json({
        message: `Changed cell in table "${tableName}", with row id ${rowId}, and field name "${fieldName}", to ${newCellValue}`,
      });
    } catch (error) {
      console.log("@/api/change-cell " + error.message);
      return response.status(500).json({ error: error.message });
    }
  }
);

app.post(
  "/api/change-field",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    try {
      // Get the table name from the request body
      const tableName = request.body.tableName;
      // Get the field name from the request body
      const fieldName = request.body.currentFieldName;
      // Get the new value to assing to cell from the request body
      const newFieldName = request.body.newFieldName;
      // Ensure that the given table name is defined
      if (!tableName) {
        console.log("Table name is required");
        return response.status(400).json({ error: "Table name is required" });
      }
      if (!fieldName) {
        console.log("Current field name is required");
        return response
          .status(400)
          .json({ error: "Current field name is required" });
      }
      if (!newFieldName) {
        console.log("New field name is required");
        return response
          .status(400)
          .json({ error: "New field name is required" });
      }
      // Validate all recieved parameters
      if (
        !isValidName(tableName) ||
        !isValidName(fieldName) ||
        !isValidName(newFieldName)
      ) {
        console.log("Invalid Parameter");
        return response.status(400).json({ error: "Invalid Parameter" });
      }
      const changeFieldNameQuery = `ALTER TABLE "${tableName}" RENAME COLUMN "${fieldName}" TO "${newFieldName}"`;
      // Execute the SQL query to create the table
      await client.query(changeFieldNameQuery);
      // Log a success message indicating that the table has been created.
      console.log(`Success in changing field name`);
      // Send an HTTP response with a success message in the response body
      response.status(200).json({
        message: `Success in changing field name`,
      });
    } catch (error) {
      console.log("Error @/api/change-field: " + error.message);
      return response.status(500).json({ error: error.message });
    }
  }
);

// Send an array of all the public tables in the SQL database
app.get(
  "/api/all-tables",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    const username = request.user.username; // get username that was in jwt from request object
    try {
      // Execute the SQL query to retrieve the table names for a specific user
      query = `select table_name, table_color from user_tables where username='${username}'`;
      const json = await client.query(
        query
        // "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
      );
      // Use json to make an array of table names
      const table_data = json.rows;
      // Log the data being sent for debugging
      console.log("Sending table names: ", table_data);
      // Send an HTTP response with an object containing the array of table names in the response body
      return response.status(200).json({ table_data: table_data });
    } catch (error) {
      console.log("Error @/api/all-tables: ", error.message);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Given an existing tables name, a valid field name, and a valid data type, add a new field to the table in the database
app.post(
  "/api/add-column",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    const { tableName, columnName, dataType } = request.body;
    const username = request.user.username;
    try {
      // Get the required values from the body of the request
      // Ensure all values are defined.
      if (!tableName) {
        console.log("Table name required");
        return response.status(400).json({ Error: "Table name required" });
      }
      if (!columnName) {
        console.log("Column name required");
        return response.status(400).json({ Error: `Column name required` });
      }
      if (!dataType) {
        console.log("data type required");
        return response.status(400).json({ Error: "data type required" });
      }
      // Validate each value before adding it to the query
      if (
        !isValidName(tableName) ||
        !isValidName(columnName) ||
        !isValidName(dataType)
      ) {
        console.log("Invalid query");
        return response.status(400).json({ Error: "invalid query" });
      }
      const tableId = await getTableId(username, tableName);
      // Execute the SQL query to add a column to the specified table
      await client.query(
        `ALTER TABLE "${tableId}" ADD "${columnName}" ${dataType}`
      );
      // Log a success message
      console.log(`Added '${columnName}' ${dataType} Field, to '${tableName}'`);
      // Send an HTTP response with a success message in the response body
      return response.status(200).json({
        message: `Added '${columnName}' ${dataType} Field, to table '${tableName}'`,
      });
    } catch (error) {
      // Check for specific error codes to handle known scenarios.
      if (error.code === "42701") {
        console.log(
          `Column "${columnName}" already exists in table "${tableName}"`
        );
        return response.status(400).json({
          error: `Column "${columnName}" already exists in table "${tableName}"`,
        });
      } else {
        console.log("Error @/api/add-column: ", error.message);
        // Send a HTTP response containing a generic error message for other errors.
        return response.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

app.post(
  "/api/add-row",
  passport.authenticate("jwt", { session: false }),
  async (request, response) => {
    try {
      const tableName = request.body.tableName;
      const username = request.user.username;
      if (!tableName) {
        console.log("Table name is required");
        return response.status(400).json({ Error: "Table name is required" });
      }
      if (!isValidName(tableName)) {
        console.log("Invalid table name");
        return response.status(400).json({ Error: "invalid table name" });
      }
      const tableId = await getTableId(username, tableName);
      newRowQuery = `INSERT INTO "${tableId}" DEFAULT VALUES`;
      await client.query(newRowQuery);
      console.log(`Added new row to table: ${tableName}`);
      return response
        .status(200)
        .json({ message: `Added new row to table: ${tableName}` });
    } catch (error) {
      console.log("Error @/api/add-row: ", error.message);
      return response
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }
);

app.post("/api/register", async (request, response) => {
  try {
    const { username, password } = request.body;
    if (!username) {
      console.log("message: username required");
      return response.status(400).json({ Error: "username required" });
    }
    if (!isValidUsername(username)) {
      console.log("invalid username");
      return response.status(400).json({ Error: "invalid username" });
    }
    if (!password) {
      console.log("password required");
      return response.json({ Error: "password required" });
    }
    await client.query(
      `INSERT INTO users (username, password) VALUES ('${username}', '${password}') `
    );
    console.log("Success: new user registered");
    return response.status(200).json({ Success: "New user registered" });
  } catch (error) {
    console.log("Error @/register: ", error.message);
    return response.json({ Error: error.message });
  }
});

app.post("/api/login", async (request, response) => {
  try {
    const username = request.body.username; // Get username from request body
    if (!username) {
      console.log("message: username required");
      return response.status(400).json({ Error: "username required" });
    }
    if (!isValidUsername(username)) {
      console.log("invalid username");
      return response.status(400).json({ Error: "invalid username" });
    }
    // Find user in db
    const result = await client.query(
      `SELECT username FROM users where username='${username}'`
    );
    if (result.rows.length === 0) {
      // If we dont get any rows in result, no user was found
      console.log("User not found");
      return response.status(404).json({ error: "User not found" });
    }
    // Payload for jwt. needed to distinguish user (dont use sensitive info like password)
    const user = {
      username: username,
    };
    const secret_key = process.env.JWT_SIGN_KEY; // Key is used to encode the jwt (very sensitive, keep in .env)
    const token = jwt.sign(user, secret_key, { expiresIn: 12000 });
    console.log("sending jwt");
    return response.status(200).json({ token }); // issue the jwt in response
  } catch (error) {
    console.log("Error @/api/login: ", error.message);
    return response.status(500).json({ Error: error.message });
  }
});

// Validate strings to ensure query safety.
function isValidName(tableName) {
  // One way to define regular expressions is with literals like this
  const validNameRegex = /^[a-zA-Z0-9 ]+$/;
  // Test the string
  return validNameRegex.test(tableName);
}

function isValidUsername(username) {
  // One way to define regular expression is with the RegExp constructor like this
  const validUserRegex = new RegExp("^[a-zA-Z0-9]{3,20}$");
  // Test the string
  return validUserRegex.test(username);
}
