import express from "express";
import { usernameValidation, passwordValidation } from "./validation.js";
import bcrypt from "bcrypt";
//@ts-ignore
import { client } from "./database.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config(); // Load the .env file
const app = express();
//This middleware parses incoming request bodies in JSON format, and makes req.body avaliable to route handlers
app.use(express.json());
app.listen(3001, () => {
    console.log("server listening on port 3001");
});
app.post("/auth/register", async (req, res) => {
    try {
        // Obtain data from http body
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        //
        if (!email || !username || !password) {
            console.log("Email, username, and password are required");
            return res
                .status(400)
                .json({ error: "Email, username, and password are required" });
        }
        if (!usernameValidation(username)) {
            return res.status(400).json({ error: "Invalid username" });
        }
        if (!passwordValidation(password)) {
            return res.status(400).json({ error: "Invalid password" });
        }
        // Hash the password before storing in database
        const hashedPassword = await bcrypt.hash(password, 11);
        const query = "INSERT INTO users(email, username, password) VALUES ($1, $2, $3)";
        const values = [email, username, hashedPassword];
        await client.query(query, values);
        return res.status(200).json({ message: "Account registered" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/auth/login", async (req, res) => {
    try {
        const email = req.body.email; //Obtain email from request
        const password = req.body.password; //Obtain password from request
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are both required" });
        }
        if (!passwordValidation(password)) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const query = "SELECT * FROM users WHERE email=$1";
        const values = [email];
        const result = await client.query(query, values);
        // See if user exists in the database
        if (result.rows.length === 0 ||
            !(await bcrypt.compare(password, result.rows[0].password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        //JWT Payload
        const user = {
            email: email,
            id: result.rows[0].id,
        };
        const secretSignKey = process.env.JWT_SIGN_KEY; //JWT secret key
        const token = jwt.sign(user, secretSignKey, { expiresIn: 12000 });
        return res.status(200).json({ token }); //Succesful login, send token in response.
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
