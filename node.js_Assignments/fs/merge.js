import fs from 'node:fs/promises';
let baseConfig = null;
const env = process.argv.slice(2);
let path = "";

try {
    const data = await fs.readFile('./config.base.json', 'utf-8');
    baseConfig = JSON.parse(data);
    console.log(baseConfig);
} catch(error) {
    if(error.code === "ENOENT") {
        console.error("Error: config.base.json is missing.");
        process.exit(1);
    } else {
        console.error(`Error parsing config.base.json:  ${error.message}`);
    }
}
let res = baseConfig;
for(let i = 0; i < env.length; ++i) {
    path = `config.${env[i]}.json`;
    try {
        const data = await fs.readFile(path, 'utf-8');
        const overrideConfig = JSON.parse(data);
        console.log(overrideConfig);
        res = deepMerge(res, overrideConfig);
    } catch(error) {
        if(error.code === "ENOENT") {
            console.warn(`Warning: ${path} not found. Skipping.`);
        } else {
            console.error(`Error parsing ${path}:  ${error.message}`);
        }
    }
}

function deepMerge(base, override) {
    const res = {...base};
    for (const key of Object.keys(override)) {
        const baseValue = base[key];
        const overrideValue = override[key];
        if (
            typeof baseValue === "object" &&
            baseValue !== null &&
            !Array.isArray(baseValue) &&
            typeof overrideValue === "object" &&
            overrideValue !== null &&
            !Array.isArray(overrideValue)
        ) {
            res[key] = deepMerge(baseValue, overrideValue);
        } else {
            res[key] = overrideValue;
        }
    }
    return res;
}

const data = JSON.stringify(res, null, 2);
console.log(data);


const finalPath = './config.final.json';
const tmpPath = './config.final.json.tmp';
await fs.writeFile(tmpPath, data);
await fs.rename(tmpPath, finalPath);
