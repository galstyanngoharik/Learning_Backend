const net = require('node:net');

let players = [];
const board = new Array(9).fill(null);
let currentTurn = 'X';
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const server = net.createServer((socket) => {
    if(players.length >= 2) {
        socket.write("Sorry, the game is full\n");
        socket.end();
        return;
    }
    const symbol = players.length === 0 ? 'X' : 'O';
    players.push({socket, symbol});
    console.log(`New player connected: ${symbol}`);
    let buffer = '';
    if (players.length === 2) {
        for (const player of players) {
            send(player.socket, `SYMBOL|${player.symbol}`);
        }
    }
    
    socket.on("data", (data) => {
        buffer += data.toString();
        const messages = buffer.split("\n");
        buffer = messages.pop();

        for (const msg of messages) {
            const message = msg.trim();

        if (message === '') {
            continue;
        }
        const parts = message.split('|');
        const command = parts[0];
        const value = parts[1];
        if(command === "MOVE") {
            const player = getPlayer(socket);
            const idx = Number(value);
            console.log("message:", JSON.stringify(message));
            if(!Number.isInteger(idx) || idx < 0 || idx > 8) {
                send(socket, "REJECTED| invalid cell");
                continue;
            }
            if(player.symbol !== currentTurn) {
                send(socket, "REJECTED| not your turn");
                continue;
            }
            if(board[idx] !== null) {
                send(socket, 'REJECTED| cell is already occupied');
                continue;
            }
            board[idx] = player.symbol;
            const boardMessage = board.map(cell => cell ?? '_').join(',');
            broadcast(`BOARD|${boardMessage}`);

            const winner = checkWinner();
            
            if (winner) {
                broadcast(`WIN|${winner}`);
                return;
            }

            if (isDraw()) {
                broadcast('DRAW');
                return;
            }
            currentTurn = currentTurn === 'X' ? 'O' : 'X';
            broadcast(`TURN|${currentTurn}`);
        }
    }
    });
    socket.on("close", () => {
        const client = getPlayer(socket);
        players = players.filter(player => player !== client);
        if(players.length === 1) {
            send(players[0].socket, 'OPPONENT_LEFT');
        }
        board.fill(null);
        currentTurn = 'X';
        console.log(`Player disconnected`);
    });
});

server.listen(3001, () => {
    console.log("server started on port 3001");
});

function send(socket, msg) {
    socket.write(msg + '\n');
}
function broadcast(msg) {
    for(const player of players) {
        send(player.socket, msg);
    }
}
function getPlayer(socket) {
    return players.find(player => player.socket === socket);
}
function checkWinner() {
    for(const [a, b, c] of winningCombinations) {
        if(board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}
function isDraw() {
    return board.every(cell => cell !== null);
}
