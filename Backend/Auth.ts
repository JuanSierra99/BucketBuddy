import express, {Request, Response} from 'express';
import { usernameValidation, passwordValidation} from "./validation.js";
import {client} from './database.js'

const app = express();
//This middleware parses incoming request bodies in JSON format, and makes req.body avaliable to route handlers
app.use(express.json()); 

app.listen(3001, () => {
  console.log("server listening on port 3001");
});

app.post("/auth/register", async (req: Request, res: Response) => {
  try {
    // Obtain data from http body
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    //
    if (!email || !password) {
      console.log("Email and password required");
      return res
        .status(400)
        .json({ error: "Email and password required" });
    }
    if(!usernameValidation(username)){
      return res.status(400).json({error: "Invalid username"})
    }
    if(!passwordValidation(password)){
      return res.status(400).json({error: "Invalid Password"})
    }
    const query =
      "INSERT INTO users(id, email, username, password) VALUES ($1, $2, $3, $4)";
    const values = [1, email, username, password];
    await client.query(query, values);
    return res.status(200).json({ message: "Account registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Regex Security
// At least one upsercase letter
// At least one Number
// At least one symbol
// At least 8 characters long
// Max 20 characters long

//