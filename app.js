const express = require("express");
const mongoose = require ("mongoose");
/* const db = require("./db"); */
const csv = require("csv-parser");
const fs = require("fs");
const parkingSchema = new mongoose.Schema({
    
});
const Parking = require("./db");

/* const Parking = mongoose.model("Parking", parkingSchema)
 */
const app = express();
const port = process.env.port || 4001;
const data = [];


/* Only need this if pulling from local file
fs.createReadStream("test_records.csv")
    .pipe(csv())
    .on("data", (row) => {
        data.push(row);
    })
    .on("end", () => {
        console.log("file processed");
    }); */

function filterByDate(records,key, datetimeString) {

    return records.filter(record=> {
        const recordDate = new Date(record[key]);
        if(isNaN(recordDate.getTime())) return false;
        if(key === "Start") return recordDate >= datetimeString;
        if(key === "End") return recordDate <= datetimeString;
        return false;
    });
}

function filterByString(records, key, value) {
    value = value.toLowerCase().trim();
    return records.filter(record => {
        const recordValue = record[key];
        return recordValue && recordValue.toLowerCase().trim() === value;
    });
}

app.get("/api/parking", async (req, res) => {
    const query = {};

    if (req.query["License Plate"]) {
        query["License Plate"] = req.query["License Plate"];
    }
    if (req.query.Lot) {
        query.Lot = req.query.Lot;
    }
    if (req.query.Start) {
        query.Start = {$gte: new Date(req.query.Start)};
    }
    if (req.query.End) {
        query.End = {$gte: new Date(req.query.End)};
    }
    try {
        const results = await Parking.find(query);
        res.json(results);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/*     res.json(results);
 */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});