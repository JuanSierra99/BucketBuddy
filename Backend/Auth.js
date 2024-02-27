var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { usernameValidation, passwordValidation } from "./validation.js";
import { client } from './database.js';
const app = express();
//This middleware parses incoming request bodies in JSON format, and makes req.body avaliable to route handlers
app.use(express.json());
app.listen(3001, () => {
    console.log("server listening on port 3001");
});
app.post("/auth/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtain the username and password from http body
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        if (!username || !password) {
            console.log("Username and password are both required");
            return res
                .status(400)
                .json({ error: "Username and password are both required" });
        }
        if (!usernameValidation(username)) {
            return res.status(400).json({ error: "Invalid username" });
        }
        if (!passwordValidation(password)) {
            return res.status(400).json({ error: "Invalid Password" });
        }
        const query = "INSERT INTO users(id, email, username, password) VALUES ($1, $2, $3, $4)";
        const values = [1, email, username, password];
        yield client.query(query, values);
        return res.status(200).json({ message: "username and password requirements met" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
//Regex Security
// At least one upsercase letter
// At least one Number
// At least one symbol
// At least 8 characters long
// Max 20 characters long
