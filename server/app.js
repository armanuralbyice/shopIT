const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/errors');
const productRoute = require('./router/product');
const userRouter = require('./router/user');
const orderRouter = require('./router/order');

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server');
    process.exit(1);
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileupload({useTempFiles: true}));
cloudinary.config({
    cloud_name: 'dkbvbllk4',
    api_key: '345532997783129',
    api_secret: 'sMWIstXxXNz7cUNcswDwPgqNI4M',
});
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.DB;

mongoose.set('strictQuery', true);
mongoose
    .connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Database connection successfully'))
    .catch((err) => console.log(err));
app.use('/api/v1', productRoute);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use(errorHandler);
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server');
    server.close(() => process.exit(1));
});
