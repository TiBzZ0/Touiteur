require('dotenv').config()

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const port = process.env.EXPOSED_PORT

if (process.env.NODE_ENV != "production") {
    console.log('CORS is enabled for development mode');
    const cors = require('cors');
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true, // Allow cookies to be sent with requests
    }));
}
const mongoose = require('mongoose')

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


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

    app.listen(port, () => {
        console.log(`Account service is running on port ${port}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use('/api/accounts', express.json(), require('./routes/account.routes'));
app.use('/api/auth', express.json(), require('./routes/auth.routes'));