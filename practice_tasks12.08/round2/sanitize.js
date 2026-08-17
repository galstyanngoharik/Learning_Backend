import fs from "node:fs/promises";
import path from "node:path";
const input = process.argv[2];
const output = process.argv[3];
const files = await fs.readdir(input)
for(const file of files) {
    const fileParse = path.parse(file);
    let name = fileParse.name.toLowerCase();
    let cleanName = "";
    for(let ch of name) {
        if((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) {
            cleanName += ch;
        } else { cleanName += "-"; }
    }
    cleanName = cleanName.replace(/-+/g, "-");
    if (cleanName.startsWith("-")) {
        cleanName = cleanName.slice(1);
    }
    if (cleanName.endsWith("-")) {
        cleanName = cleanName.slice(0, -1);
    }

    let ext = fileParse.ext.toLowerCase();
    const res = cleanName + ext;
    const src = path.join(input, file);
    const dest = path.join(output, res);
    await fs.copyFile(src, dest);
}