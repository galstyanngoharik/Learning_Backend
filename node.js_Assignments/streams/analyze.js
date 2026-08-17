import fs from 'node:fs';
import { Transform } from 'node:stream';

const stream = fs.createReadStream("server.log");
let leftover = "";

const transform = new Transform({
    transform(chunk, encoding, cb) {
        const lines = (leftover + chunk.toString()).split('\n');
        leftover = lines.pop();
        for(const line of lines) {
            this.push(line);
        }
        cb();
    },
    flush(cb) {
        if(leftover) {
            this.push(leftover);
        }
        cb();
    }
});
stream.pipe(transform);
let linesProcessed = 0;
let errorCount = 0;
let warnCount = 0;
let infoCount = 0;
let lastError = null;
let longestGap = 0;
let longestGapStart = null;
let longestGapEnd = null;

transform.on("data", (line) => {
    linesProcessed++;
    const text = line.toString();
    if(text.includes("[ERROR]")) {
        const timestamp = text.split(" ")[0];
        const currTime = new Date(timestamp).getTime();
        if(lastError) {
            const gap = (currTime - lastError) / 1000;
            if(gap > longestGap) { 
                longestGap = gap;
                longestGapStart = lastError;
                longestGapEnd = currTime;
            }
        }
        lastError = currTime;
        errorCount++;
    }
    else if(text.includes("[WARN]")) {
        warnCount++;
    }
    else if(text.includes("[INFO]")) {
        infoCount++;
    }
});

transform.on("end", () => {
    console.log(`
    Lines processed: ${linesProcessed}
    ERROR: ${errorCount}
    WARN: ${warnCount}
    INFO: ${infoCount}
    Longest gap between ERRORs: ${longestGap} seconds
    (between ${new Date(longestGapStart).toISOString()} and ${new Date(longestGapEnd).toISOString()})
    `);
}); 