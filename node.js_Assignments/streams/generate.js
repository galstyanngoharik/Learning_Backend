import fs from 'node:fs';
const stream = fs.createWriteStream("server.log");
let timestamp = Date.now();
for(let i = 0; i < 100000; ++i) {
    let level = Math.floor(Math.random() * 3);
    let date = new Date(timestamp).toISOString();
    if(level === 0) {
        stream.write(`${date} [INFO] Request handled\n`);
    }
    else if(level === 1) {
        stream.write(`${date} [WARN] Request handled\n`);
    }
    else {
        stream.write(`${date} [ERROR] Request handled\n`);
    }
    timestamp+=20000;
}

