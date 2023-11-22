function getRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const colorCode = `#${randomColor.padStart(6, '0')}`;
    return colorCode;
}

function getSessionId() {
    const id = document.querySelector('#sessionId');
    return id.innerHTML;
}

function setSessionId(newId) {
    const id = document.querySelector('#sessionId');
    id.innerHTML = `{ "id": "${newId}", "color": "${getRandomHexColor()}" }`;
}

function getMatchStatus() {
    const matchStatus = document.querySelector('#matchStatus');
    return matchStatus.innerHTML;
}

function setMatchStatus(newStatus) {
    const matchStatus = document.querySelector('#matchStatus');
    return matchStatus.innerHTML = newStatus;
}

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

    let sessionIdJSON = getSessionId();
    let sessionId = JSON.parse(sessionIdJSON);
    sock.emit('message', {
        sender: sessionId.id,
        color: sessionId.color,
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
})

sock.on('startMatch', (json) => {
    setMatchStatus('started');
});