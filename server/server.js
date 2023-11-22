const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// Object.assign(global, { WebSocket: require('ws') });


// ****************************
// ****** Socket server: ******
// ****************************

const app = express();
let filePath = `${__dirname}/../client/`;
app.use(express.static(filePath));

const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;

function newServerMsg(jsonArgs) {
    return {
        sender: 'Server',
        ...jsonArgs
    }
}

io.on('connection', (sock) => {
    if (waitingPlayer) {
        [waitingPlayer, sock].forEach(s => s.emit('message', newServerMsg({
            msg: `2 Players joined. Starting a match...`
        })));
        waitingPlayer = null;
        sock.emit('joinMatch', newServerMsg({
            'isHost': false
        }));
        io.emit('startMatch', newServerMsg({}));
    }
    else {
        sock.emit('joinMatch', newServerMsg({
            matchId: 'testMatchId',
            isHost: true,
        }))
        waitingPlayer = sock;
    }

    sock.on('message', (text) => {
        io.emit('message', text);
    })
})

server.on('error', (err) => {
    console.error('Server error:', err);
})

server.listen(8000, () => {
  console.log('Server started on port 8000');
});