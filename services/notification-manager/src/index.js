require('dotenv').config()

const express = require('express')
const app = express()
const http = require("http");
const { Server } = require('socket.io')
const port = process.env.EXPOSED_PORT
const Notification = require('./models/notification.model');
const mongoose = require('mongoose')
  
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL, credentials: true } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV != "production") {
    console.log('CORS is enabled for development mode');
    const cors = require('cors');
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }));
}

mongoose
    .connect('mongodb://' + process.env.MONGO_USER + ":" + process.env.MONGO_PW + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME)
    .then(() => {
        console.log('Connected to MongoDB')
        // Démarre le serveur HTTP + WebSocket
        server.listen(port, () => {
            console.log(`Notification manager listening on port ${port}`)
        })
    }).catch(err => {
        console.error('Could not connect to MongoDB', err)
    })

app.use('/api/notifications', express.json(), require('./routes/notification.routes'));


io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);

    socket.on("subscribe", (userId) => {
        socket.join(userId);
        socket.data.userId = userId;
        console.log(`Socket ${socket.id} subscribed to user ${userId}`);
    });

    socket.on("sendNotification", async ({ receiverId, senderId, message }) => {
        try {
            const notification = new Notification({ receiverId, senderId, message });
            await notification.save();
            console.log("Notification saved:", notification);
        } catch (error) {
            console.error("Error saving notification:", error);
            return;
        }

        io.to(receiverId).emit("notification", { senderId, message });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected :", socket.id);
        socket.leave(socket.data.userId);
    });

    io.on("connect_error", (err) => console.error("Erreur de connexion socket :", err));
});