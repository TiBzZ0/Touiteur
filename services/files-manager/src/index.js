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
app.use('/uploads', express.static('uploads'));

mongoose
	.connect('mongodb://' + process.env.MONGO_USER + ":" + process.env.MONGO_PW + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME)
		.then(() => {
			console.log('Connected to MongoDB')
			app.listen(port, () => {
				console.log(`file-manager listening on port ${port}`)
			})
		}).catch(err => {
			console.error('Could not connect to MongoDB', err)
		})

app.use('/api/files', express.json(), require('./routes/file.routes'));