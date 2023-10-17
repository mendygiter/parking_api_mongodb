const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const port = process.env.port || 3000;
const data = [];

fs.createReadStream("test_records.csv")
    .pipe(csv())
    .on("data", (row) => {
        data.push(row);
    })
    .on("end", () => {
        console.log("file processed");
    });

app.get("/api/query", (req, res) => {
    const {licensePlate, lot, start, end} = req.query;

    let results = data;
    if (licensePlate) results = results.filter((record) => record["License Plate"] === licensePlate);
    if (lot) results = results.filter((record) => record['Lot'] === lot);
    if (start) results = results.filter((record) => new Date(record['Start']) >= new Date(start));
    if (end) results = results.filter((record) => new Date(record['end']) <= new Date(end));

    res.json(results);
});

app.listen(port, () => {
    console.log("server is running");
});

