const socket = io('http://localhost:3000');

let roomName;
let clickCount = 0;
let opponentClickCount = 0;

document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    socket.emit('joinGame');
});

document.querySelectorAll('.backToMenuButton').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('menu').style.display = 'block';
        document.getElementById('game').style.display = 'none';
        document.getElementById('gameover').style.display = 'none';
        resetGame();
    });
});

socket.on('waitingForOpponent', () => {
    document.getElementById('status').textContent = 'Waiting for an opponent...';
});

socket.on('startGame', (data) => {
    roomName = data.roomName;
    document.getElementById('status').textContent = 'Game started! First to 10 clicks wins!';
    document.getElementById('clickButton').disabled = false;
});

document.getElementById('clickButton').addEventListener('click', () => {
    clickCount++;
    document.getElementById('clickCount').textContent = clickCount;
    socket.emit('click', { roomName, clicks: clickCount });

    if (clickCount >= 10) {
        socket.emit('winGame', roomName);
    }

    
});

socket.on('opponentClick', (data) => {
    opponentClickCount = data.opponentClicks;
    document.getElementById('opponentClickCount').textContent = opponentClickCount;
});

socket.on('gameOver', (data) => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('gameover').style.display = 'block';
    if (data.winner === socket.id) {
        document.getElementById('winner').textContent = 'you won!';   
    } else {
        document.getElementById('winner').textContent = 'u lost.. maybe next time!';
    }
    

});

function resetGame() {
    clickCount = 0;
    opponentClickCount = 0;
    document.getElementById('clickCount').textContent = clickCount;
    document.getElementById('opponentClickCount').textContent = opponentClickCount;
    document.getElementById('status').textContent = 'Waiting for an opponent...';
    document.getElementById('clickButton').disabled = true;
}
