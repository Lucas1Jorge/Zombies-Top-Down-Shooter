const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { connect } = require('http2');

// ****************************
// ****** Socket server: ******
// ****************************

const app = express();
let filePath = `${__dirname}/../client/`;
app.use(express.static(filePath));

const server = http.createServer(app);
const io = socketio(server);

minNumOfPlayers = 2;
let playersCnt = 0;
let playersSockets = [];
let playersDict = {};

function newServerMsg(jsonArgs) {
    return {
        sender: 'Server',
        ...jsonArgs
    }
}

io.on('connection', (sock) => {
    let isHost = playersSockets.length === 0 ? true : false;
    playersSockets.push(sock);

    sock.emit('joinMatch', newServerMsg({
        // matchId: 'testMatchId',
        'isHost': isHost
    }));

    sock.on('joinedMatch', (json) => {
        playersCnt++;
        console.log(`Joined confirmed. ${playersCnt} connected players`);
        playersDict[json.id] = json.player;
        if (playersCnt === minNumOfPlayers) {
            console.log(`All Players joined. Starting a match...`);
            // console.log(`Players:`, playersDict);
            playersSockets.forEach(playerSocket => playerSocket.emit('message', newServerMsg({
                msg: `All Players joined. Starting a match...`
            })));
            io.emit('startMatch', newServerMsg({
                'playersDict': playersDict
            }));
            playersSockets = [];
            playersDict = {};
            playersCnt = 0;
        }
    })

    sock.on('message', (text) => {
        io.emit('message', newServerMsg(text));
    })

    sock.on('move', (json) => {
        playersDict[json.id] = json.player;
        json.playersDict = playersDict
        io.emit('move', newServerMsg(json));
    });

    sock.on('shoot', (json) => {
        io.emit('shoot', newServerMsg(json));
    });

    sock.on('spawnEnemy', (json) => {
        io.emit('spawnEnemy', newServerMsg(json));
    });
})

server.on('error', (err) => {
    console.error('Server error:', err);
})

server.listen(8000, () => {
  console.log('Server started on port 8000');
});