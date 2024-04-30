//@ts-ignore
import { client } from "./database.js";
import express from "express";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import jwt from "jsonwebtoken";
const app = express();
dotenv.config();
app.use(express.json()); //Needed to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Needed when we use post in html form
// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());
const port = process.env.PORT; // Run this api server on port 3000
app.listen(port, () => {
    console.log(`API Server is running on port ${port}`);
});
// Middleware for authenticating users with JWT. Used to secure api endpoints.
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]; // Get authorization header content
    const token = authHeader && authHeader.split(" ")[1]; // Get JWT from authentication header
    const secretSignKey = process.env.JWT_SIGN_KEY;
    if (!token)
        return res.status(401).json({ error: "No token was provided" }); // Return error if token undefined/null
    if (!secretSignKey) {
        console.log("JWT_SIGN_KEY is not defined");
        return res.status(500).send("JWT_SIGN_KEY is not defined"); // Return error if secret key is undefined/null
    }
    // Verify that token was not tampered with
    jwt.verify(token, secretSignKey, (err, user) => {
        if (err)
            return res.status(403).json({ error: "Unauthorized user" }); // Return error, user could not be authenticated
        req.user = user; // Add JWT payload to html request
        next();
    });
};
// userId is critical for queries, this middlepoint will help with debugging.
const ensureUserIdExists = (req, res, next) => {
    const userId = req.user?.id;
    //For debugging. userId should be guaranteed to have a value because it comes from JWT after authentication.
    if (!userId) {
        console.error("User id has no value");
        return res.status(400).json({ error: "User id has no value" }); //Return error if variable is undefined/null
    }
    next();
};
app.use(authenticateToken); //Use authentication middleware for all endpoints.
app.use(ensureUserIdExists); //Debugging middleware
// Create a new user table.
app.post("/create-table", async (req, res) => {
    try {
        //obtain following data from request
        const tableName = req.body.tableName;
        const userId = req.user.id;
        let tableColor = req.body.tableColor;
        if (!tableName) {
            console.error("Table name has no value");
            return res.status(400).json({ error: "Table name has no value" }); //Return error if variable is undefined/null
        }
        if (!tableColor) {
            tableColor = "white"; //Assign default color if variable is undefined/null
        }
        const trimmedTableName = tableName.trim(); //Remove leading/trailing whitespace from variable tableName
        const uniqueTableId = uuidv4(); //Generate a unique id for the table
        const createTableQuery = "INSERT INTO USERS_TABLES (table_id, user_id, table_name, table_color ) VALUES($1, $2, $3, $4)";
        const values = [uniqueTableId, userId, trimmedTableName, tableColor];
        // Using parameterized query
        await client.query(createTableQuery, values);
        console.log(`Successfuly created table: ${tableName}`);
        // Send an HTTP response with a success message in the body
        return res.status(200).json({
            message: `Successfully created table: ${tableName}`,
        });
    }
    catch (error) {
        console.error("Internal server error. Failed to create table.");
        return res
            .status(500)
            .json({ error: "Internal server error. Failed to create table." });
    }
});
// Returns all tables for authenticated user.
app.get("/user-tables", async (req, res) => {
    try {
        const userId = req.user.id;
        const getTablesQuery = "SELECT table_id, table_name, table_color FROM USERS_TABLES WHERE user_id = $1";
        const values = [userId];
        const result = await client.query(getTablesQuery, values);
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Internal server error. Failed to retrieve user tables.");
        return res.status(500).json({
            error: "Internal server error. Failed to retrieve user tables.",
        });
    }
});
app.post("/delete-table", async (req, res) => {
    try {
        const userId = req.user.id;
        const tableId = req.body.tableId;
        // Check if tableId is provided
        if (!tableId) {
            return res.status(400).json({ error: "Table ID was not provided." });
        }
        // Begin postgres transaction.
        await client.query("BEGIN");
        const values = [tableId];
        const deleteCellsQuery = "DELETE FROM cell_data WHERE table_id = $1 ";
        await client.query(deleteCellsQuery, values);
        const deleteRowsQuery = "DELETE FROM ROW_METADATA WHERE table_id = $1";
        await client.query(deleteRowsQuery, values);
        const deleteColumnsQuery = "DELETE FROM COLUMN_METADATA WHERE table_id = $1";
        await client.query(deleteColumnsQuery, values);
        const deleteUserTableQuery = "DELETE FROM USERS_TABLES WHERE table_id=$1";
        const result = await client.query(deleteUserTableQuery, values);
        // Check if any rows were deleted
        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ error: "Table not found or already deleted." });
        }
        await client.query("COMMIT");
        return res.status(200).json({ message: "Table deleted successfully." });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.log("Internal server error. Failed to delete user table", error);
        return res
            .status(500)
            .json({ error: "Internal server error. Failed to delete user table." });
    }
});
// Add a new column for a user table.
app.post("/new-column", async (req, res) => {
    try {
        const columnName = req.body.columnName;
        const dataType = req.body.dataType;
        const tableId = req.body.tableId;
        const userId = req.user.id;
        const validDataTypes = ["text", "rating", "number", "bool"];
        if (!tableId) {
            return res.status(400).json({ error: "Table ID was not provided." });
        }
        if (!columnName) {
            return res.status(400).json({ error: "Column name was not provided." });
        }
        if (!dataType) {
            return res
                .status(400)
                .json({ error: "Column data type was not provided." });
        }
        if (!validDataTypes.includes(dataType.toLowerCase())) {
            return res
                .status(400)
                .json({ error: "Invalid column data type provided." });
        }
        const addColumnQuery = `
    INSERT INTO COLUMN_METADATA (column_name, data_type, table_id, column_id, user_id) 
      VALUES($1, $2, $3, $4, $5)`;
        const columnId = uuidv4();
        const values = [
            columnName,
            dataType.toLowerCase(),
            tableId,
            columnId,
            userId,
        ];
        await client.query(addColumnQuery, values);
        return res.status(200).json({ message: "Column added successfully" });
    }
    catch (error) {
        if (error.code === "23505")
            return res.status(409).json({ error: "Column already exists" });
        console.log("Internal server error. Failed to add column");
        return res
            .status(500)
            .json({ error: "Internal server error. Failed to add column" });
    }
});
// Add a new column for a user table.
app.post("/new-row", async (req, res) => {
    try {
        const tableId = req.body.tableId;
        const userId = req.user.id;
        if (!tableId) {
            return res.status(400).json({ error: "Table ID was not provided." });
        }
        const rowId = uuidv4();
        const addRowQuery = `
    INSERT INTO ROW_METADATA (table_id, row_id, user_id) 
    VALUES($1, $2, $3)`;
        const values = [tableId, rowId, userId];
        await client.query(addRowQuery, values);
        return res.status(200).json({ message: "Row added successfully" });
    }
    catch (error) {
        console.log("Internal server error. Failed to add row");
        return res
            .status(500)
            .json({ error: "Internal server error. Failed to add row" });
    }
});
app.post("/new-cell", async (req, res) => {
    try {
        const tableId = req.body.tableId;
        const columnId = req.body.columnId;
        const rowId = req.body.rowId;
        const data = req.body.data;
        if (!columnId) {
            return res.status(400).json({ error: "Column Id was not provided" });
        }
        if (!rowId) {
            return res.status(400).json({ error: "Row Id was not provided" });
        }
        if (!tableId) {
            return res.status(400).json({ error: "Table Id was not provided" });
        }
        if (!data) {
            return res.status(400).json({ error: "Cell data was not provided" });
        }
        const cellQuery = `
    INSERT INTO cell_Data (table_id, column_id, row_id, data) 
    VALUES ($1, $2, $3, $4)
    `;
        const values = [tableId, columnId, rowId, data];
        await client.query(cellQuery, values);
        return res.status(200).json({ message: "Added data to cell" });
    }
    catch (error) {
        console.log("/new-cell error: ", error);
        return res
            .status(500)
            .json({ message: "Inernal Server error. Failed to create new cell" });
    }
});
app.post("/get-table-data", async (req, res) => {
    try {
        const tableId = req.body.tableId;
        if (!tableId) {
            return res.status(400).json({ error: "Table ID was not provided" });
        }
        const getColumnsQuery = `
    SELECT column_name, column_id, data_type
    FROM column_metadata
    WHERE table_id = $1
    `;
        const columnQueryValues = [tableId];
        const columnsResponse = await client.query(getColumnsQuery, columnQueryValues);
        const columnData = columnsResponse.rows;
        if (columnData.length === 0) {
            return res.status(404).json({
                message: "No data to send. Could not find table",
            });
        }
        const columnIds = columnData.map((c) => {
            return { id: c.column_id, name: c.column_name };
        });
        if (columnIds.length === 0) {
            return res.status(404).json({
                message: "No data to send. Could not find columns",
            });
        }
        // Constructing the SELECT clause dynamically. Use join to make it one string for the query.
        const selectClause = columnIds
            .map((c) => {
            return `MAX(CASE WHEN column_id = '${c.id}' THEN data END) AS ${c.name}`;
        })
            .join(", ");
        const getDataQuery = `
    SELECT row_id,
   ${selectClause}
    FROM cell_data
    GROUP BY row_id
    `;
        const cellResponse = await client.query(getDataQuery);
        const cellData = cellResponse.rows;
        return res.status(200).json({ columns: columnData, data: cellData });
    }
    catch (error) {
        console.log("Internal server error. Failed to send table data.");
        return res
            .status(500)
            .json({ error: "Internal server error. Failed to send table data." });
    }
});
