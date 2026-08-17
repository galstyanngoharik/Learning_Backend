const fs = require('node:fs');
const path = require('node:path');
const src = process.argv[2];
const dest = process.argv[3];
const move = process.argv[4] === "--move";
if(!src || !dest) {
    console.error("error");
    process.exit(1);
}
const srcDir = path.resolve(src);
const destDir = path.resolve(dest);
if (!fs.existsSync(srcDir)) {
    console.error(`"${srcDir}" not found`);
    process.exit(1);
}

function getAllFiles(dirpath) {
    let files = [];
    const entries = fs.readdirSync(dirpath, {withFileTypes:true});
    for(const entry of entries) {
        const fullPath = path.join(dirpath, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getAllFiles(fullPath));
        } else if (entry.isFile()) {
          
            files.push(fullPath);
        }
    }
    return files;
}
const allFiles = getAllFiles(srcDir);

for(const filepath of allFiles) {
    const filename = path.basename(filepath);
    const fileparse = path.parse(filename);
    if(fileparse.name === fileparse.base && filename[0] === ".") {
        const hiddenPath = path.join(dest, "hidden");
        fs.mkdirSync(hiddenPath, {recursive:true});
        let targetPath = path.join(hiddenPath, filename);
        let i = 1;
        while(fs.existsSync(targetPath)) {
            const newName = fileparse.name + "-" + i++ + fileparse.ext;
            targetPath = path.join(hiddenPath, newName);
        }
        try {
            move ? fs.renameSync(filepath, targetPath) :  fs.copyFileSync(filepath, targetPath);
        } catch(error) {
            console.log(`Failed to move/copy ${filepath}: ${error.message}`);  
        }
        continue;
    }
    let folderName = "";
    if(!path.extname(filename)) { folderName = "no-extension"; }
    else { folderName = path.extname(filename).slice(1); }
    const targetdir = path.join(dest, folderName); 
    fs.mkdirSync(targetdir, {recursive:true});
    let targetPath = path.join(targetdir, filename);
    let i = 1;
    while(fs.existsSync(targetPath)) {
        const newName = fileparse.name + "-" + i++ + fileparse.ext;
        targetPath = path.join(targetdir, newName);
    }
    try {
        move ? fs.renameSync(filepath, targetPath) :  fs.copyFileSync(filepath, targetPath);
    } catch(error) {
        console.log(`Failed to move/copy ${filepath}: ${error.message}`);  
    }
} 
