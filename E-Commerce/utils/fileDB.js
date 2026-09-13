const fs = require("node:fs");
const path = require("node:path");

function readData(fileName) {
    const filePath = path.join(__dirname, '../data', fileName);
    const data = fs.readFileSync(filePath, "utf-8");;
    return JSON.parse(data);
}
function writeData(fileName, data) {
    const filePath = path.join(__dirname, '../data', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
module.exports = { readData, writeData };

