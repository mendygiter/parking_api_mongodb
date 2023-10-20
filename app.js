const express = require("express");
const db = require("./db");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const Parking = mongoose.model("Parking", parkingSchema)
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

app.get("/api/parking", async (req, res) => {
    const query = {};

    if (req.query["License Plate"]) {
        query["License Plate"] = req.query["License Plate"];
    }

    }

    res.json(results);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});