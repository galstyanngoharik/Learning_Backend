const fs = require('node:fs');
const recordsData = [];
const inSeconds = Math.floor(Date.now() / 1000);
for(let i = 0; i < 12; ++i) {
    recordsData.push({
        timestamp : inSeconds + i,
        temperature : 22.5,
        sensorId : (i % 3) + 1
    });
}

const magic = "SNSR"
const version = 1;
const recordCount = recordsData.length;

const headerSize = 7;
const recordSize = 9;
const totalSize = headerSize + (recordCount * recordSize) + 1;

const buf = Buffer.alloc(totalSize);

let offset = 0;
buf.write(magic, offset, 4, 'ASCII');
offset += 4;

buf.writeUInt8(version, offset);
offset += 1;

buf.writeUInt16BE(recordCount, offset);
offset += 2;

const start = offset;
for(const record of recordsData) {
    buf.writeUInt32BE(record.timestamp, offset);
    offset += 4;
    buf.writeFloatBE(record.temperature, offset);
    offset += 4;
    buf.writeUInt8(record.sensorId, offset);
    offset += 1;
}

let checkSum = 0;
for(let i = start; i < offset; ++i) {
    checkSum = (checkSum + buf[i]) % 256;
}
buf.writeUInt8(checkSum, offset);

fs.writeFileSync('records.bin', buf);
console.log('File records.bin successfully created!');
