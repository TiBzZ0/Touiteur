const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.EXPOSED_PORT || 3000;

if (process.env.NODE_ENV != "production") {
    console.log('CORS is enabled for development mode');
    const cors = require('cors');
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true, // Allow cookies to be sent with requests
    }));
}

app.use(express.json());

app.use('/api/reports', require("./routes/report.routes"));

mongoose.connect('mongodb://' + process.env.MONGO_USER + ":" + process.env.MONGO_PW + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Report-manager is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    });