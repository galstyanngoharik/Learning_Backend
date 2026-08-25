import net from "node:net";
import readline from "node:readline";

const client = net.createConnection(3002, "localhost", () => {
    console.log("Connected to server.\n");
    askUsername();
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.question("Enter your username: ", (username) => {
    client.write(`${username}\n`);
});

client.on("data", (data) => {
    const str = data.toString();
    if(str.startsWith('ERROR')) {
        console.log(str);
        askUsername();
    } else if(str.startsWith('OK')){ 
        console.log(str);
        startChat();
    } else { console.log(str); }
});

client.on("close", () => {
    console.log("Disconnected from server.");
    rl.close();
});

client.on("error", (err) => {
    console.log(`Client error: ${err.message}`);
});

function startChat() {
    rl.on("line", (message) => {
        client.write(`${message}\n`);
    });
}

function askUsername() {
    rl.question("enter your username", (username) => {
        client.write(`${username}\n`);
    });
}
