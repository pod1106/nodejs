const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let waitingPlayer = null;



app.use(cors());
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', () => {
        if (waitingPlayer) {
            const roomName = `room-${socket.id}-${waitingPlayer.id}`;
            console.log(roomName);
            socket.join(roomName);
            waitingPlayer.join(roomName);

            io.to(roomName).emit('startGame', { roomName });
            waitingPlayer = null;
        } else {
            waitingPlayer = socket;
            socket.emit('waitingForOpponent');
        }
    });

    socket.on('click', (data) => {
        const roomName = data.roomName;
        const clickCount = data.clicks;
        socket.to(roomName).emit('opponentClick', { opponentClicks: clickCount });
    });



    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (waitingPlayer === socket) {
            waitingPlayer = null;
        }
    });

    socket.on('winGame', (roomName) => {
        console.log(`Player in ${roomName} won the game`);
        io.to(roomName).emit('gameOver', { winner: socket.id });
        io.in(roomName).socketsLeave(roomName);
    });
});

server.listen(PORT, () => {
    console.log(`link: http://localhost:${PORT}`);
});
