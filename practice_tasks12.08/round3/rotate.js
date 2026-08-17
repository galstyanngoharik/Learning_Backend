import fs from "node:fs/promises";
import path from "node:path";
const limit = 1024;
const file = process.argv[2];

async function rotate() {
    try {
        const stats = await fs.stat(file);
        const size = stats.size;
            if(size > limit) {
                const timestamp = new Date().toISOString();
                let newName = "";
                for(let ch of timestamp) {
                    if(ch === ":") {
                    newName += "-";
                    } else { newName += ch; }
                }
                const fileparse = path.parse(file);
                const archiveName = fileparse.name + "-" + newName + fileparse.ext;
                await fs.rename(file, archiveName);
                await fs.writeFile(file, "");
            }
    } catch(error) {
        if(error.code === "ENOENT") {
            console.log(`No log file yet at ${file} -- nothing to rotate.`);
            return;
        }
    }
}
rotate();
console.log("Rotated: app.log -> app-...log (fresh log created)");