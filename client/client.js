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
        playersQueue[playerId] = [];
    }
    setMatchStatus('started');
});

sock.on('move', (json) => {
    if (json.id === sessionId)
        return;
    playersQueue[json.id].push(json);
})

function trimBuffer(id) {
    if (playersQueue[id].length > 20) {
        for (let i = 0; i < 5; i++) {
            playersQueue[id].shift();
        }
    }
    else if (playersQueue[id].length > 10) {
        playersQueue[id].shift();
    }
}

function updatePlayersMove() {
    for (id in playersQueue) {
        trimBuffer(id);

        if (playersQueue[id].length > 0) {
            let json = playersQueue[id][0];
            playersQueue[id].shift();
            let player = playersDict[id];
            player.pos.x = json.posX;
            player.pos.y = json.posY;
            player.angle = json.angle;
        }
    }
}

sock.on('shoot', (json) => {
    if (json.id === sessionId)
        return;
    // playersQueue[json.id].push(json);
    let player = playersDict[json.id];
    player.shoot();
})

sock.on('spawnEnemy', (enemy) => {
    if (getSessionId() !== 'Host') {
        let newZombie = new Zombie(enemy.speed);
        newZombie.id = enemy.id;
        newZombie.player = playersDict[enemy.playerId];
        newZombie.pos = createVector(enemy.x, enemy.y);
        zombies.push(newZombie);
        zombiesDict[newZombie.id] = newZombie;
    }
})

sock.on('killEnemy', (payload) => {
    delete zombiesDict[payload.zombieId];
});



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

function broadCastZombie(zombieId) {
    let latestZombie = zombiesDict[zombieId];
    let enemy = {
        id: latestZombie.id,
        speed: latestZombie.speed,
        playerId: latestZombie.player.userId,
        x: latestZombie.pos.x,
        y: latestZombie.pos.y
    };
    sock.emit('spawnEnemy', enemy);
}

function broadcastZombieDeath(zombieId) {
    sock.emit('killEnemy', zombieId);
}