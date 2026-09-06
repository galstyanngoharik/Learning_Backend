const net = require('node:net');
const readline = require('node:readline');

const client = net.createConnection(3001, "localhost", () => {
    console.log("Connected to server");
});
let buffer = '';

client.on("data", (data) => {
    buffer += data.toString();
    const messages = buffer.split('\n');
    buffer = messages.pop();

    for (const msg of messages) {
        const message = msg.trim();

        if(message === ("")) {
            continue;
        }
    console.log(msg);
    }
});
client.on("close", () => {
    console.log("Disconnected from server.");
});
client.on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const value = input.trim();
    if(!value) { return; }

    client.write(`${value}\n`);
});