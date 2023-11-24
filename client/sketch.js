let myPlayer;
let sessionId;

let players = [];
let playersDict = {};
let zombies = [];

let framesTillCreate = 20;
let frame = 0;
let speed = 2;
let score = 0;

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
  // zombies.push(new Zombie(random(speed)));

  // userName = prompt(`Username (How you're seen by others):`);
  // setSessionId(userName);
  // 
  sessionId = getSessionId();
}

function showLoadingAnimation() {
  document.getElementsByClassName('loading-animation')[0].style.display = 'block';
}

function hideLoadingAnimation() {
  document.getElementsByClassName('loading-animation')[0].style.display = 'none';
}

function draw() {
  if (!checkMatchStarted()) {
    // Show loading animation if waiting for more players to connect
    showLoadingAnimation();
    return;
  }
  
  // Start match if all players connected
  hideLoadingAnimation();
  image(grassImg, 0, 0, width * 2, height * 2);
  frame++;

  players = [];
  for (userId in playersDict) {
    players.push(playersDict[userId]);
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
    zombies[i].draw();
    zombies[i].update();
    for (player of players) {
      if (player.shot(zombies[i])) {
        zombies.splice(i, 1);
        score++;
      }
    }
  }
  
  if (frame > framesTillCreate && zombies.length < 10) {
    zombies.push(new Zombie(random(speed)));
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