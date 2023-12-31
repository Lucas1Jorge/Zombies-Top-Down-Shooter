let myPlayer;
let sessionId;

let players = [];
let playersDict = {};
let playersQueue = {};
let zombies = [];
let zombiesDict = {};
let currZombieId = 0;

let framesTillCreate = 5;
let frame = 0;
let speed = 3;
let score = 0;
let zoom = 1;

function setup() {
  createCanvas(700, 700);
  imageMode(CENTER);
  playersDict = {};
  players = []
  for (i of [0, 1]) {
    players.push(new Player());
    playersDict[i] = new Player();
  }
  zombieImg = loadImage("assets/zombie.png");
  playerImg = loadImage("assets/player.png");
  grassImg = loadImage("./assets/grass.jpg");

  // userName = prompt(`Username (How you're seen by others):`);
  // setSessionId(userName);
  
  zoom = 1.4;
  sessionId = "New Session";
}

function showLoadingScreen() {
  document.getElementsByClassName('loading-animation')[0].style.display = 'block';
  document.getElementsByClassName('join-match-button')[0].style.display = 'block';
}

function hideLoadingScreen() {
  document.getElementsByClassName('loading-animation')[0].style.display = 'none';
  document.getElementsByClassName('join-match-button')[0].style.display = 'none';
}

function draw() {
  if (!checkMatchStarted()) {
    showLoadingScreen();
    return;
  }
  
  // Start match if all players connected
  hideLoadingScreen();
  sessionId = getSessionId();
  image(grassImg, 0, 0, width * 2, height * 2);
  frame++;

  updatePlayersMove();
  players = [];
  for (userId in playersDict) {
    players.push(playersDict[userId]);
  }
  zombies = [];
  for (zombieId in zombiesDict) {
    zombies.push(zombiesDict[zombieId]);
  }
  
  for (player of players) {
    player.draw();
    if (player.userId === sessionId) {
      myPlayer = player;
      player.update();
    }
  
    player.drawNamePlate();
  }
  
  for (let i = zombies.length - 1; i >= 0; i--) {
    let zombie = zombies[i];
    zombie.draw();
    zombie.update();
    if (myPlayer.shot(zombie)) {
      score++;
      delete zombiesDict[zombie.id];
      broadcastZombieDeath(zombie.id);
    }
  }
  
  if (frame > framesTillCreate && zombies.length < 10) {
    if (sessionId === 'Host') {
      let currZombie = new Zombie(random(speed));
      zombies.push(currZombie);
      zombiesDict[currZombie.id] = currZombie;
      broadCastZombie(currZombie.id);
      currZombieId++;
    }
    frame = 0;
    if (framesTillCreate > 20) {
      framesTillCreate *= 0.95;
    }
  }
  
  if (frameCount % 1000 == 0) {
    speed+=0.1;
  }
  
  fill('#ffffff');
  textStyle(NORMAL);
  textAlign(CENTER);
  textSize(40);
  text(score, width/2, 100);
  
  broadCastMove();
}

function keyPressed() {
  if (event.key === 'c') {
    myPlayer.shoot();
    broadCastShoot();
  }
}