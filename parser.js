const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Define the input CSV file path
const inputCsvFilePath = 'test_records.csv'; // Replace with your CSV file path

// Define the date and time you want to match
const targetDateTime = moment('2023-10-03 9:00:00', '2023-10-03 9:00:00');

// Initialize an array to store the JSON data
const jsonData = [];

// Read the CSV file, parse the data, and convert it to JSON
fs.createReadStream(inputCsvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Parse the 'start' column as a moment object
        const startDateTime = moment(row.start, '2023-10-03 9:00:00');

        if (startDateTime.isSameOrAfter(targetDateTime)) {
            // Include this row and all following rows
            jsonData.push(row);
        }
    })
    .on('end', () => {
        // Output the JSON data
        console.log(JSON.stringify(jsonData, null, 2));
    });
