import fs from 'node:fs/promises';
const input = process.argv[2];
const output = process.argv[3];
let count = process.argv[4];
const buffer = await fs.readFile(input);
count = ((count % 26) + 26) % 26;
for(let i = 0; i < buffer.length; ++i) {
    let byte = buffer[i];
    if((byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122)) {
        if(byte >= 65 && byte <= 90) {
            byte = (byte - 65 + count) % 26 + 65;
        } else {
            byte = (byte - 97 + count) % 26 + 97;
        }
    }
}

await fs.writeFile(output, buffer);
