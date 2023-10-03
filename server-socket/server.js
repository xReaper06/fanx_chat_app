require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./config/dbConnection.js');
const userRoute = require('./routes/userRoute.js');
const app = express();
const http = require('http');
const server = http.createServer(app);
const initializeSocketIO = require('./controllers/chatController.js')

initializeSocketIO(server);
// Use bodyParser.urlencoded before bodyParser.json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static('public'));
app.use('/api', userRoute);
app.use('/api/uploads', express.static('public'));

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3000');
   });