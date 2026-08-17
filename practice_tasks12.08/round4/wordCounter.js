import fs from 'node:fs';

const file = process.argv[2];
const stream = fs.createReadStream("text.txt");
let remainder = "";
let count = 0;
let bytes = 0;
stream.on("data", (chunk) => {
    const words = (remainder + chunk.toString()).split(/\s+/);
    count += words.length-1;
    remainder = words[words.length-1];
    bytes += chunk.length;
});
stream.on("end", () => {
    if(remainder !== "") { 
        count++; 
    }
    console.log(`Words: ${count}`);
    console.log(`Bytes processed: ${bytes}`);
}); 