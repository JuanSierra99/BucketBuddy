const client = require("./database");
const express = require("express");
const cors = require("cors");
const passport = require("./passport-config");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Api server framework
const app = express();

// const { table } = require("console");

// Needed for cross origin requests
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json()); //Needed to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Needed when we use post in html form

const port = 3000; // Run this api server on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Send row data of the specific table
app.get("/api/get-table", async (req, response) => {
  try {
    const table_name = req.query.name;
    if (!table_name) {
      console.log("Table name is required");
      return response.status(400).json({ Error: "Table name is required" });
    }
    if (!isValidName(table_name)) {
      return response.status(400).json({ Error: "Invalid table name " });
    }
    const query = `SELECT * FROM "${table_name}"`;
    // Execute the SQL query to get the specified table's rows, and assing it to data
    const data = await client.query(query);
    const rows = data.rows;
    // Log the data for debugging
    console.log(`Sending rows for ${table_name}: `, rows);
    // Send an HTTP response with data in the response body
    return response.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

// FINISH THIS ONE I MADE IT SUPER QUICK
app.get("/api/table-fields", async (request, response) => {
  try {
    const table_name = request.query.name;
    if (!table_name) {
      console.log("table name required");
      return response.status(400).json({ message: "table name required" });
    }
    if (!isValidName(table_name)) {
      console.log("Invalid table name");
      return response.status(400).json({ message: "Invalid table name" });
    }
    const query = `SELECT column_name FROM information_schema.columns WHERE table_name='${table_name}' AND column_name!='unique_record_id'`;
    const json = await client.query(query);
    const fields = json.rows.map((row) => {
      return row.column_name;
    });
    console.log("Sending fields for " + table_name + " table: ", fields);
    return response.status(200).json(fields);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

// In the SQL database, create a new table using the speicified name
app.post("/api/new-table", async (request, response) => {
  try {
    // Get the name of table from the request body
    const tableName = request.body.name;
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
    const createTableQuery = `CREATE TABLE "${tableName}" (unique_record_id SERIAL PRIMARY KEY , Name VARCHAR)`;
    // Execute the SQL query to create the table
    await client.query(createTableQuery);
    // Log a success message indicating that the table has been created.
    console.log(`Created Table: ${tableName}`);
    // Send an HTTP response with a success message in the response body
    response
      .status(200)
      .json({ message: `Table "${tableName}" created successfully` });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: "Table creation failed" });
  }
});

// Double check validation for this one. Wrote this one kinda fast so make sure it looks good !!!!!!!!!
// In the SQL database, create a new table using the speicified name
app.post("/api/change-cell", async (request, response) => {
  try {
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
      return response.status(400).json({ error: "New cell value is required" });
    }
    // Validate all recieved parameters
    if (
      !isValidName(tableName) ||
      !isValidName(rowId) ||
      !isValidName(fieldName) ||
      !isValidName(newCellValue)
    ) {
      console.log("Invalid Parameter");
      return response.status(400).json({ error: "Invalid Parameter" });
    }
    const changeCellQuery = `UPDATE "${tableName}" SET "${fieldName}" = '${newCellValue}' WHERE unique_record_id=${rowId}`;
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
    console.log("Error: " + error.message);
    return response.status(500).json({ error: error.message });
  }
});

app.post("/api/change-field", async (request, response) => {
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
      return response.status(400).json({ error: "New field name is required" });
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
    console.log("Error: " + error.message);
    return response.status(500).json({ error: error.message });
  }
});

// Send an array of all the public tables in the SQL database
app.get("/api/all-tables", async (req, response) => {
  try {
    // Execute the SQL query to retrieve the table names
    const json = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    // Use json to make an array of table names
    const table_names = json.rows.map((row) => {
      return row.table_name;
    });
    // Log the data being sent for debugging
    console.log("Sending table names: ", table_names);
    // Send an HTTP response with an object containing the array of table names in the response body
    return response.status(200).json({ table_names: table_names });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

// Given an existing tables name, a valid field name, and a valid data type, add a new field to the table in the database
app.post("/api/add-column", async (request, response) => {
  const { tableName, columnName, dataType } = request.body;
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
    // Execute the SQL query to add a column to the specified table
    await client.query(
      `ALTER TABLE "${tableName}" ADD "${columnName}" ${dataType}`
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
      console.log(error.message);
      // Send a HTTP response containing a generic error message for other errors.
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/add-row", async (request, response) => {
  try {
    const tableName = request.body.tableName;
    if (!tableName) {
      console.log("Table name is required");
      return response.status(400).json({ Error: "Table name is required" });
    }
    if (!isValidName(tableName)) {
      console.log("Invalid table name");
      return response.status(400).json({ Error: "invalid table name" });
    }
    newRowQuery = `INSERT INTO "${tableName}" DEFAULT VALUES`;
    await client.query(newRowQuery);
    console.log(`Added new row to table: ${tableName}`);
    return response
      .status(200)
      .json({ message: `Added new row to table: ${tableName}` });
  } catch (error) {
    console.log({ error: error.message });
    return response
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

app.post("/register", async (request, response) => {
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
    console.log("Error: ", error.message);
    return response.json({ Error: error.message });
  }
});

app.post("/login", async (request, response) => {
  try {
    const username = request.body.username;
    if (!username) {
      console.log("message: username required");
      return response.status(400).json({ Error: "username required" });
    }
    if (!isValidUsername(username)) {
      console.log("invalid username");
      return response.status(400).json({ Error: "invalid username" });
    }
    const result = await client.query(
      `SELECT username FROM users where username='${username}'`
    );
    if (result.rows.length === 0) {
      console.log("User not found");
      return response.status(404).json({ error: "User not found" });
    }
    const user = {
      username: username,
    };
    const secret_key = process.env.JWT_SIGN_KEY; // used here to encode the jwt
    const token = jwt.sign(user, secret_key, { expiresIn: 10 });
    console.log("sending jwt");
    return response.json({ token }); // issue the jwt in response
  } catch (error) {
    console.log("Error: ", error.message);
    return response.json({ Error: error.message });
  }
});

// Validate strings to ensure query safety. (IS THIS GOOD ENOUGH ??)
function isValidName(tableName) {
  // one way to define regular expressions is with literals like this
  const validNameRegex = /^[a-zA-Z0-9_ ]+$/;
  // test the string
  return validNameRegex.test(tableName);
}

function isValidUsername(username) {
  // One way to define regular expression is with constructor like this
  const validUserRegex = new RegExp("^[a-zA-Z0-9_.]{3,15}$");
  // test the string
  return validUserRegex.test(username);
}
