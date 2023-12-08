const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const hostelRoutes = require("./routes/hostel");
const bedRecordsRoutes = require("./routes/bedRecords");
const chatRoutes = require("./routes/chats");

require("dotenv").config();

const MONGO_URI =
    // `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@fyp-cluter.qauvmhw.mongodb.net/HostelManagementApp?retryWrites=true&w=majority`;
    "mongodb://127.0.0.1:27017/HostelManagementApp";
const app = express();

app.use(bodyParser.json({ limit: '7mb' }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS ,GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next();
})

app.use("/users", userRoutes);
app.use("/hostels", hostelRoutes);
app.use("/hostel-beds", bedRecordsRoutes);
app.use("/chats", chatRoutes);


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected!");
        app.listen(1234);
    })
    .catch(err => {
        console.log(err)
    })

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({ message: message, data: data })
})    