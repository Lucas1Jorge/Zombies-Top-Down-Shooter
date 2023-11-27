// ****************************
// ******** Team chat *********
// ***** Sending messages *****
// ****************************

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



// ****************************
// ******* Match events *******
// ***** Enable listeners *****
// ****************************

function onJoinMatchButtonClicked() {
    sock.emit('joinMatch', {});
}

document
    .querySelector('#join-match-button')
    .addEventListener('click', onJoinMatchButtonClicked);



sock.on('joiningMatch', (json) => {
    if (json.isHost) {
        json.msg = `You are the HOST. Waiting for other players to join`;
        writeEvent(json);
        setSessionId('Host');
    }
    else {
        setSessionId('Guest');
    }
    setMatchStatus('waiting');

    // userName = prompt(`Username (How you're seen by others):`);
    // setSessionId(userName);
    
    sock.emit('joinedMatch', {
        id: getSessionId(),
        color: getSessionColor(),
    })
})

sock.on('startMatch', (json) => {
    playersDict = {};
    for (playerId in json.playersDict) {
        let playerUpdated = json.playersDict[playerId];
        let playerCopy = new Player(playerUpdated.id, playerUpdated.color);
        playersDict[playerId] = playerCopy;
    }
    setMatchStatus('started');
});

sock.on('move', (json) => {
    if (json.id === sessionId)
        return;
    let player = playersDict[json.id];
    player.pos.x = json.posX;
    player.pos.y = json.posY;
    player.angle = json.angle;
})

sock.on('shoot', (json) => {
    if (json.id === sessionId)
        return;
    let player = playersDict[json.id];
    player.shoot();
})

sock.on('spawnEnemy', (enemy) => {
    if (getSessionId() !== 'Host') {
        let newZombie = new Zombie(enemy.speed);
        newZombie.player = playersDict[enemy.playerId];
        newZombie.pos = createVector(enemy.x, enemy.y);
        zombies.push(newZombie);
    }
})



// ****************************
// ******** Broadcasts ********
// ****************************

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

function broadCastZombie() {
    let latestZombie = zombies[zombies.length - 1];
    let enemy = {
        speed: latestZombie.speed,
        playerId: latestZombie.player.userId,
        x: latestZombie.pos.x,
        y: latestZombie.pos.y
    };
    sock.emit('spawnEnemy', enemy);
}