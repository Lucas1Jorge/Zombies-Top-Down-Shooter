// ***********************************
// *** Team chat: sending messages ***
// ** Writing events with socket.io **
// ***********************************

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



function onFormSubmitted(e) {
    e.preventDefault();
    
    const input = document.querySelector('#chat-input');
    const text = input.value;
    input.value = '';

    sock.emit('message', {
        sender: getSessionId(),
        color: getSessionColor(),
        msg: text
    });
}

document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted);

    this.host = false;



// ***********************************
// ********** Match events ***********
// ******** Enable listeners *********
// ***********************************

sock.on('joinMatch', (json) => {
    if (json.isHost) {
        json.msg = `You are the HOST. Waiting for another player to join`;
        writeEvent(json);
        setSessionId('Host');
    }
    else {
        setSessionId('Guest');
    }
    setMatchStatus('waiting');

    // userName = prompt(`Username (How you're seen by others):`);
    // setSessionId(userName);
    
    let newPlayer = new Player(getSessionId(), getSessionColor());
    // newPlayer.pos = createVector(width/2, height/2);
    newPlayer.pos = createVector(500, 350);
    playersData[getSessionId()] = newPlayer;

    sock.emit('joinedMatch', {
        id: getSessionId(),
        color: getSessionColor(),
        player: playersData[getSessionId()],
    })
})

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
    for (player of players) {
        if (player.userId === json.id) { // && player.userId !== getSessionId()) {
            player.pos.x = json.posX;
            player.pos.y = json.posY;
            player.angle = json.angle;
        }
    }
})

sock.on('shoot', (json) => {
    for (player of players) {
        if (player.userId === json.id) { // && player.userId !== getSessionId()) {
            player.shoot();
        }
    }
})



// ***********************************
// *********** Broadcasts ************
// ***********************************

function broadCastMove() {
    sock.emit('move', {
        id: getSessionId(),
        posX: myPlayer.pos.x,
        posY: myPlayer.pos.y,
        angle: myPlayer.angle
    });
}

function broadCastShoot() {
    sock.emit('shoot', {
        id: getSessionId()
    });
}