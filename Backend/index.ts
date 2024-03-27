//@ts-ignore
import { client } from "./database.js";
import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const app = express();

dotenv.config();
app.use(express.json()); //Needed to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Needed when we use post in html form

const port = 3000; // Run this api server on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Middleware for authenticating users with JWT. Used to secure api endpoints.
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]; // Get authorization header content
  const token = authHeader && authHeader.split(" ")[1]; // Get JWT from authentication header
  const secretSignKey = process.env.JWT_SIGN_KEY as string;
  if (!token) return res.status(401).json({ error: "No token was provided" }); // Return error if token undefined/null
  if (!secretSignKey) {
    console.log("JWT_SIGN_KEY is not defined");
    return res.status(500).send("JWT_SIGN_KEY is not defined"); // Return error if secret key is undefined/null
  }
  // Verify that token was not tampered with
  jwt.verify(token, secretSignKey, (err, user) => {
    if (err) return res.status(403).json({ error: "Unauthorized user" }); // Return error, user could not be authenticated
    req.user = user; // Add JWT payload to html request
    next();
  });
};

// userId is critical for queries, this middlepoint will help with debugging.
const ensureUserIdExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
app.post("/create-table", async (req: Request, res: Response) => {
  try {
    //obtain following data from request
    const tableName: string = req.body.tableName;
    const userId: number = req.user.id;
    let tableColor: string = req.body.tableColor;
    if (!tableName) {
      console.error("Table name has no value");
      return res.status(400).json({ error: "Table name has no value" }); //Return error if variable is undefined/null
    }
    if (!tableColor) {
      tableColor = "white"; //Assign default color if variable is undefined/null
    }
    const trimmedTableName: string = tableName.trim(); //Remove leading/trailing whitespace from variable tableName
    const uniqueTableId: string = uuidv4(); //Generate a unique id for the table
    const createTableQuery = "INSERT INTO USERS_TABLES VALUES($1, $2, $3, $4)";
    const values: any[] = [uniqueTableId, userId, trimmedTableName, tableColor];
    // Using parameterized query
    await client.query(createTableQuery, values);
    console.log(`Successfuly created table: ${tableName}`);
    // Send an HTTP response with a success message in the body
    return res.status(200).json({
      message: `Successfully created table: ${tableName}`,
    });
  } catch (error) {
    console.error("Internal server error. Failed to create table.");
    return res
      .status(500)
      .json({ error: "Internal server error. Failed to create table." });
  }
});

app.get("/user-tables", async (req: Request, res: Response) => {
  try {
    const userId: number = req.user.id;
    const getTablesQuery =
      "SELECT table_id, table_name, table_color FROM USERS_TABLES WHERE user_id = $1";
    const values: any[] = [userId];
    const result = await client.query(getTablesQuery, values);
    return res.status(200).json({ tables: result.rows });
  } catch (error) {
    console.error("Internal server error. Failed to retrieve user tables.");
    return res.status(500).json({
      error: "Internal server error. Failed to retrieve user tables.",
    });
  }
});

app.post("/delete-table", async (req: Request, res: Response) => {
  try {
    const userId: number = req.user.id;
    const tableId: string = req.body.tableId;
    // Check if tableId is provided
    if (!tableId) {
      return res.status(400).json({ error: "Table ID was not provided." });
    }
    // Begin postgres transaction.
    await client.query("BEGIN");

    const values: any[] = [userId, tableId];
    const deleteRowsQuery =
      "DELETE FROM ROW_METADATA WHERE user_id = $1 AND table_id = $2";
    await client.query(deleteRowsQuery, values);
    const deleteColumnsQuery =
      "DELETE FROM COLUMN_METADATA WHERE user_id = $1 AND table_id = $2";
    await client.query(deleteColumnsQuery, values);
    const deleteUserTableQuery =
      "DELETE FROM USERS_TABLES WHERE user_id=$1 AND table_id=$2";
    const result = await client.query(deleteUserTableQuery, values);
    // Check if any rows were deleted
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Table not found or already deleted." });
    }
    await client.query("COMMIT");

    return res.status(200).json({ message: "Table deleted successfully." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Internal server error. Failed to delete user table");
    return res
      .status(500)
      .json({ error: "Internal server error. Failed to delete user table." });
  } finally {
    client.release();
  }
});

// Add a new column for a user table.
app.post("/new-column", async (req: Request, res: Response) => {
  try {
    const columnName: string = req.body.columnName;
    const dataType: string = req.body.dataType;
    const tableId: string = req.body.tableId;
    const userId: number = req.user.id;

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
    const columnId: string = uuidv4();
    const values: any[] = [
      columnName,
      dataType.toLowerCase(),
      tableId,
      columnId,
      userId,
    ];
    await client.query(addColumnQuery, values);
    return res.status(200).json({ message: "Column added successfully" });
  } catch (error: any) {
    if (error.code === "23505")
      return res.status(409).json({ error: "Column already exists" });
    console.log("Internal server error. Failed to add column");
    return res
      .status(500)
      .json({ error: "Internal server error. Failed to add column" });
  }
});

// Add a new column for a user table.
app.post("/new-row", async (req: Request, res: Response) => {
  try {
    const tableId: string = req.body.tableId;
    const columnId: string = req.body.columnId;
    const rowData: string = req.body.rowData;
    const userId: number = req.user.id;

    if (!tableId) {
      return res.status(400).json({ error: "Table ID was not provided." });
    }
    if (!columnId) {
      return res.status(400).json({ error: "Column ID was not provided." });
    }
    if (!rowData) {
      return res.status(400).json({ error: "Row data was not provided." });
    }

    const rowId: string = uuidv4();
    const addRowQuery = `
    INSERT INTO ROW_METADATA (table_id, column_id, row_data, row_id, user_id) 
    VALUES($1, $2, $3, $4, $5)`;
    const values: any[] = [tableId, columnId, rowData, rowId, userId];
    await client.query(addRowQuery, values);
    return res.status(200).json({ message: "Row added successfully" });
  } catch (error: any) {
    console.log("Internal server error. Failed to add row");
    return res
      .status(500)
      .json({ error: "Internal server error. Failed to add row" });
  }
});

app.post("/get-table", async (req: Request, res: Response) => {
  try {
    const userId: number = req.user.id;
    const tableId: string = req.body.tableId;
    if (!tableId) {
      return res.status(400).json({ error: "Table ID was not provided" });
    }
    const getTableQuery = `
    SELECT r.row_data, r.row_id, c.column_id, c.column_name, c.data_type
    FROM row_metadata as r LEFT JOIN column_metadata AS c ON c.column_id = r.column_id 
    WHERE r.table_id = $1 AND r.user_id = $2`;
    const values: any[] = [tableId, userId];
    const result = await client.query(getTableQuery, values);
    return res.status(200).json({ tableData: result.rows });
  } catch (error) {
    console.log("Internal server error. Failed to send table data.");
    return res
      .status(500)
      .json({ error: "Internal server error. Failed to send table data." });
  }
});
