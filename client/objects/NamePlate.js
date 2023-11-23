class NamePlate {
    constructor(playerId, playerPosition, playerColor) {
      this.id = playerId;
      this.playerPosition = playerPosition;
      this.color = playerColor;
    //   this.text = createInput();
    }
  
    draw() {
        fill(this.color);
        textStyle(BOLD);
        textSize(16);
        textAlign(CENTER);
        text(this.id, this.playerPosition.x, this.playerPosition.y - 30); // Draw the fixed text
        // textStyle(NORMAL);
    }

    update(playerPosition) {
        // Offset the nameplate slightly above the player's head
        this.position = playerPosition;
    }
}