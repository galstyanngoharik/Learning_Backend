import net from "node:net";

const map1 = new Map;
const map2 = new Map;

const PORT = 3002;
const server = net.createServer((socket) => {
    let buffer = "";
    socket.on("data", (data) => {
        buffer += data.toString();
        while (buffer.includes("\n")) {
            const index = buffer.indexOf("\n");
            const str = buffer.slice(0, index).trim();
            buffer = buffer.slice(index + 1);
            if(!map2.has(socket)) {
                if(str === "") { socket.write("ERROR: Username cannot be empty. Please try again.\n"); }
                else if(map1.has(str)) {
                    socket.write("ERROR: Username already taken.\n");
                } else {
                    map1.set(str, socket);
                    map2.set(socket, str);
                    broadcast(socket, `*** ${str} joined ***\n`);
                    socket.write(`OK: ${str} connected\n`);
                }
            }
            else {
                if(str.startsWith("/msg")) {
                    const parts = str.split(" ");
                    const username = parts[1];
                    const msg = parts.slice(2).join(" ");
                    if(!username || !msg) {
                        socket.write("Usage: /msg <username> <message>\n");
                    }
                    else if(!map1.has(username)) {
                        socket.write(`User ${username} is not connected.\n`);
                    } else {
                        const target = map1.get(username);
                        target.write(msg);
                    }
                } 
                else if(str === "/who") {
                    let arr = [];
                    for(const name of map1.keys()) {
                        arr.push(name);
                    }
                    socket.write(`Connected users: ${arr}\n`);
                } else {
                    broadcast(socket, str);
                }
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on("close", () => {
    const username = map2.get(socket);
    broadcast(socket, `*** ${username} left ***\n`);
    map2.delete(socket);
    map1.delete(username);
});

server.on("error", (err) => {
    console.log(`Socket error: ${err.message}`);
}); 

function broadcast(senderSocket, msg) {
    const username = map2.get(senderSocket);
    const time = new Date().toLocaleTimeString();
    map1.forEach((socket) => {
        if(socket !== senderSocket) {
            socket.write(`${[time]}.[${username}]: ${msg}\n`);
        }
    });
}

