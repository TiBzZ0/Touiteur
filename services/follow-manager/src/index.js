require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')

if (process.env.NODE_ENV != "production") {
    console.log('CORS is enabled for development mode');
    const cors = require('cors');
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true, // Allow cookies to be sent with requests
    }));
}

mongoose
.connect('mongodb://' + process.env.MONGO_USER + ":" + process.env.MONGO_PW + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME)
.then(() => {
    console.log('Connected to MongoDB');

    app.listen(process.env.EXPOSED_PORT, () => {
        console.log(`Follow service is running on port ${process.env.EXPOSED_PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use('/api/follow', express.json(), require('./routes/follow.routes'));