import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import 'dotenv/config';

const app = express();

// Create Express app and http server
const server = http.createServer(app)

// Middleware setup
app.use(express.json({ limit: "4mb" })) // we add maximum of 4mb size image
app.use(cors()) // to allow cross-origin requests

app.use('/api/status', (req,res)=>{
    res.send("Server is running")
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

// Connect to database
await connectDB();