const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
const data = [];

fs.createReadStream("test_records.csv")
    .pipe(csv())
    .on("data", (row) => {
        data.push(row);
    })
    .on("end", () => {
        console.log("File processed.");
    });

function parseCustomDateTime(dateTime) {
    const parts = dateTime.split(/[- :]/);
    if (parts.length === 6) {
        const [year, month, day, hour, minute, second] = parts.map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
    }
    return null;
}

app.get("/api/parking", (req, res) => {
    const { start, end, plates, lot } = req.query;

    let results = data;

    if (plates) {
        const value = plates.toLowerCase().trim();
        results = results.filter(record => record['plates'] && record['plates'].toLowerCase().trim() === value);
    }

    if (lot) {
        const value = lot.toLowerCase().trim();
        results = results.filter(record => record['lot'] && record['lot'].toLowerCase().trim() === value);
    }

    if (start) {
        const startDate = parseCustomDateTime(start);
        if (startDate) {
            results = results.filter(record => {
                const recordDate = new Date(record['start']); // assuming 'start' is the key name in the CSV
                return recordDate && recordDate >= startDate;
            });
        }
    }

    if (end) {
        const endDate = parseCustomDateTime(end);
        if (endDate) {
            results = results.filter(record => {
                const recordDate = new Date(record['end']); // assuming 'end' is the key name in the CSV
                return recordDate && recordDate <= endDate;
            });
        }
    }

    res.json(results);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
