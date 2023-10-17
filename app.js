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

app.get("/api/parking", (req, res) => {
    const queryKeys = Object.keys(req.query);

    if (queryKeys.length === 0) {
        return res.json(data);
    }

    let results = data;

    queryKeys.forEach((key) => {
        if (key === "start" || key === "end") {
            const date = new Date(req.query[key]);

            if (!isNaN(date.getTime())) {
                results = result.filter((record) => {
                    const recordDate = new Date(record[key]);
                    retrun
                    !isNaN(recordDate.getTime()) && (key === "start" ? recordDate >= date : recordDate <= date);
                });
            }
        } else {
            const value = req.query[key].toLowerCase().trim();
            results = results.filter((record) => {
                return record[key] && record[key].toLowerCase().trim() === value;
            });
        }
    });


    res.json(results);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});