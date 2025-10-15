import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io"

const app = express();

// Create Express app and http server
const server = http.createServer(app)

// initialise socket.io server
export const io = new Server(server, {
    cors:{origin:"*"}
})

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected",userId)

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit online users to all connected clients
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

// Middleware setup
app.use(express.json({ limit: "4mb" })) // we add maximum of 4mb size image
app.use(cors()) // to allow cross-origin requests

app.use('/api/status', (req,res)=>{
    res.send("Server is running")
})
app.use("/api/auth", userRouter);
app.use("/api/messages",messageRouter)

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

// Connect to database
await connectDB();