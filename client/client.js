// *****************************
// ********* Socket.io *********
// ******* Writing events ******
// *****************************

function writeEvent(json) {
    // <ul> element
    const parent = document.querySelector('#events');
  
    // <li> element
    const el = document.createElement('li');
    const senderColor = json.color ? json.color : "#00ff00";
    let text = `<b color="${senderColor}">${json.sender}:</b> ${json.msg}`
    el.innerHTML = text;

    parent.appendChild(el);
}  
writeEvent({
    sender: `Chat`,
    msg:`uSurvivor: Started match`
});

const sock = io();
sock.on('message', writeEvent);



// ****************************
// ******** Team chat *********
// ***** Sending messages *****
// ****************************

function onFormSubmitted(e) {
    e.preventDefault();
    
    const input = document.querySelector('#chat-input');
    const text = input.value;
    input.value = '';

    // let sessionIdJSON = getSessionId();
    // let sessionInfoJSON = getSessionInfo();
    // let sessionInfo = JSON.parse(sessionInfoJSON);
    sock.emit('message', {
        // sender: sessionInfo.id,
        // color: sessionInfo.color,
        sender: getSessionId(),
        color: getSessionColor(),
        msg: text
    });
}

document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted);

    this.host = false;



// ****************************
// ****** Match events ********
// *** Creating and Joining ***
// ****************************

sock.on('joinMatch', (json) => {
    if (json.isHost) {
        json.msg = `You are the HOST. Waiting for another player to join`;
        writeEvent(json);
        setSessionId('Host');
        // setMatchStatus('waiting');
    }
    else {
        setSessionId('Guest');
        // if (json.msg === `2 Players joined. Starting a match...`) {
        //     setMatchStatus('started');
        // }
    }
    setMatchStatus('waiting');

    // userName = prompt(`Username (How you're seen by others):`);
    // setSessionId(userName);
    // 
    // this.pos = createVector(width/2, height/2);
    let newPlayer = new Player(getSessionId(), getSessionColor());
    // newPlayer.pos = createVector(width/2, height/2);
    newPlayer.pos = createVector(500, 350);
    playersData[getSessionId()] = newPlayer;

    // playersDict[json.id] = json.player;
    // json.playersDict = playersDict
    // io.emit('move', json);
    sock.emit('joinedMatch', {
        id: getSessionId(),
        color: getSessionColor(),
        player: playersData[getSessionId()],
    })
})

function spawnPlayers() {
    let i = 0;
    for (id in playersData) {
        players[i] = playersData[id];
        i++;
    }
}

sock.on('startMatch', (json) => {
    setMatchStatus('started');
    players = [];
    for (playerId in json.playersDict) {
        let playerUpdated = json.playersDict[playerId];
        let playerCopy = new Player(playerUpdated.userId, playerUpdated.color);
        players.push(playerCopy);
    }
});

sock.on('move', (json) => {
    // players = [];
    // for (playerId in json.playersDict) {
    //     players.push(playersDict[playerId]);
    // }
})

sock.on('shoot', (json) => {
    for (player of players) {
        if (player.userId === json.id) { // && player.userId !== getSessionId()) {
            player.shoot();
        }
    }
})

// sock.on('move', (json) => {
//     let newPlayer = new Player(getSessionId(), getSessionColor());
//     // newPlayer.pos = createVector(width/2, height/2);
//     newPlayer.pos = createVector(350, 350);
//     // playersData[json.id] = newPlayer;
//     // playersData[json.id] = new Player();
// });

function broadCastEvent(event) {
    sock.emit(event, {
        id: getSessionId(),
        // color: getSessionColor(),
        // player: myPlayer,
    });
    // sock.emit('message', { 
    //     msg: `Player ${getSessionId()} shot`
    // });
}

function broadCastShoot() {
    sock.emit('shoot', {
        id: getSessionId()
    });
    // sock.emit('message', { 
    //     msg: `Player ${getSessionId()} shot`
    // });
}