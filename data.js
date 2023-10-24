const csv = require("csv-parser");
const fs = require ("fs");
const Parking = require("./db");
const { log } = require("console");

fs.createReadStream("test_records.csv")
    .pipe(csv())
    .on("data", async (row) => {
        const parkingRecord = new Parking(row);
        try {
            const savedRecord = await parkingRecord.save();
            console.log("Saved record:", savedRecord);
        } catch (err) {
            console.error("Erro Saving Record", err);
        }
    })
    .on ("end", () => {
        console.log("CSV file Proccessed");
    });