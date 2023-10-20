const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/parkingDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("connected to MongoDB");
});

module.exports.db;

const parkingSchema = new mongoose.Schema({
    "License Plate": String,
    "Lot": String,
    "Start": Date,
    "End": Date
});