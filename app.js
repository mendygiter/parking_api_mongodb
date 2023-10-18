const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const port = process.env.port || 4001;
const data = [];

fs.createReadStream("test_records.csv")
    .pipe(csv())
    .on("data", (row) => {
        data.push(row);
    })
    .on("end", () => {
        console.log("file processed");
    });

function filterByDate(records,key, datetimeString) {
    //const formattedDateTime = datetimeString.replace(" ", "T");
   // const comparisonDate = new Date(formattedDateTime);

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

app.get("/api/parking", (req, res) => {
    let results = data.slice();

    if (req.query["License Plate"]) {
        results = filterByString(results, "License Plate", req.query["License Plate"]);
    }
    if (req.query.Lot) {
        results = filterByString(results, "Lot", req.query.Lot);
    }
    if (req.query.Start) {
        const startDate = new Date(req.query.Start);
        if (!isNaN(startDate.getTime())) {
            results = filterByDate(results, "Start", startDate);
        }
    }
    if (req.query.End) {
        const endDate = new Date(req.query.End);
        if (!isNaN(endDate.getTime())) {
            results = filterByDate(results, 'End', endDate);
        }
    }

    res.json(results);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});