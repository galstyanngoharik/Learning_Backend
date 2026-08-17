import { Downloader } from "./downloader.js";
const downloader = new Downloader();
downloader.on("progress", (percentage) => {
    const filled = Math.floor(percentage / 100 * 20);
    const empty = 20 - filled;
    const bar = "[" + "#".repeat(filled) + "-".repeat(empty) + "]";
    process.stdout.write("\r" + bar + " " + percentage + "%");
});

downloader.on("done", () => {
    console.log("\nDownload complete!");
});

downloader.start();