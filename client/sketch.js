let players = [];
let zombies = [];
let userName;

let framesTillCreate = 20;
let frame = 0;
let speed = 2;
let score = 0;

function setup() {
  createCanvas(700, 700);
  imageMode(CENTER);
  for (i of [0, 1]) {
    players.push(new Player());
  }
  zombieImg = loadImage("assets/zombie.png");
  playerImg = loadImage("assets/player.png");
  grassImg = loadImage("./assets/grass.jpg");
  zombies.push(new Zombie(random(speed)));

  // userName = prompt(`Username (How you're seen by others):`);
  // setSessionId(userName);
}

function checkMatchStarted() {
  // const matchStartMsg = `2 Players joined. Starting a match...`;
  const matchStatus = document.querySelector('#matchStatus');
  return matchStatus.innerHTML === 'started';
}

function showLoadingAnimation() {
  let load = document.getElementsByClassName('loading-animation')[0].style.display = 'block';
  return
}

function hideLoadingAnimation() {
  let load = document.getElementsByClassName('loading-animation')[0].style.display = 'none';
  return;
}

function draw() {
  if (!checkMatchStarted()) {
    showLoadingAnimation(); // Show loading animation if waiting for more players to connect
    return;
  }
  
  hideLoadingAnimation(); // all players connected: starting match
  
  image(grassImg, 0, 0, width * 2, height * 2);

  frame++;
  let direction = "left";
  for (player of players) {
    player.draw();
    player.update(direction);
    direction = "right";
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
  textAlign(CENTER);
  textSize(40);
  text(score, width/2, 100);
  
}

function mouseClicked() {
  players[0].shoot();
}

function keyPressed() {
  if (event.key === 'x') { // Check if 'x' (keyCode 120) is pressed
    players[1].shoot();
  }
}