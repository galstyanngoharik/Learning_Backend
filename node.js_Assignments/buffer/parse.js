const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'records.bin'); 
if(!fs.existsSync(filePath)) {
    console.error("file not found");
    process.exit(1);
}

const buf = fs.readFileSync(filePath);
let offset = 0;
const magic = buf.toString('ascii', offset, offset+4);
offset += 4;
if(magic !== "SNSR") { 
    console.error("invalid magic");
    process.exit(1);
}

const version = buf.readUInt8(offset);
offset += 1;
if(version !== 1) {
    console.error("invalid version");
    process.exit(1);
}

const recordCount = buf.readUInt16BE(offset);
offset += 2;

let start = offset;
let checkSum = buf.readUInt8(buf.length-1);
let sum = 0;
for(let i = start; i < buf.length-1; ++i) {
    sum = (sum + buf[i]) % 256;
}
if(sum !== checkSum) {
    console.error("invalid checkSum");
    process.exit(1);
}
const records = [];
for (let i = 0; i < recordCount; ++i) {
    const timestamp = buf.readUInt32BE(offset);
    offset += 4;

    const temperature = buf.readFloatBE(offset);
    offset += 4;

    const sensorId = buf.readUInt8(offset);
    offset += 1;

    records.push({ timestamp, temperature, sensorId });
}

let tempSum = 0;
const sensorCounts = {};

for (const record of records) {
    tempSum += record.temperature;
    sensorCounts[record.sensorId] = (sensorCounts[record.sensorId] || 0) + 1;
}

const avgTemp = (tempSum / records.length).toFixed(2);

let activeSensor = null;
let maxCount = 0;

for (const [sensorId, count] of Object.entries(sensorCounts)) {
    if (count > maxCount) {
        maxCount = count;
        activeSensor = sensorId;
    }
}
console.log(records.length);
console.log(avgTemp);
console.log(activeSensor);

