class Player {
  constructor(customSpeed = null) {
    this.pos = createVector(width/2, height/2);
    this.bullets = [];
    this.angle = 0;
    this.customSpeed = customSpeed ? customSpeed : 2;
  }

  draw() {
    rectMode(CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    rotate(this.angle);
    image(playerImg, 0, 0, 30, 30);
    pop();
    
    
    for (let bullet of this.bullets) {
      bullet.draw();
      bullet.update();
    }
    
    if (this.bullets.length > 20) {
      this.bullets.splice(0, 1);
    }
  }

  update(playerSide) {
    let sidewaysSpeed = 0;
    let forwardSpeed = 0;
    if (playerSide === "left") {
      if (keyIsDown(65)) sidewaysSpeed = -this.customSpeed; // A
      if (keyIsDown(68)) sidewaysSpeed = this.customSpeed; // D
      if (keyIsDown(87)) forwardSpeed = -this.customSpeed; // S
      if (keyIsDown(83)) forwardSpeed = this.customSpeed; // W
    }
    else if (playerSide === "right") {
      if (keyIsDown(74)) sidewaysSpeed = -this.customSpeed; // J
      if (keyIsDown(76)) sidewaysSpeed = this.customSpeed; // L
      if (keyIsDown(73)) forwardSpeed = -this.customSpeed; // K
      if (keyIsDown(75)) forwardSpeed = this.customSpeed; // I
    }
    this.pos.add(sidewaysSpeed, forwardSpeed);
  }
  
  shot(zombie) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (dist(this.bullets[i].x, this.bullets[i].y, zombie.pos.x, zombie.pos.y) < 10) {
        this.bullets.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  
  shoot() {
    this.bullets.push(new Bullet(this.pos.x, this.pos.y, this.angle));
  }
}
