class NamePlate {
    constructor(playerId, playerPosition, playerColor) {
      this.id = playerId;
      this.playerPosition = playerPosition;
      this.color = playerColor;
    }
  
    draw() {
        fill(this.color);
        textStyle(BOLD);
        textSize(16);
        textAlign(CENTER);
        
        // Draw the fixed text:
        text(this.id, this.playerPosition.x, this.playerPosition.y - 30);
        // textStyle(NORMAL);
    }

    update(playerPosition) {
        // Offset the nameplate slightly above the player's head
        this.position = playerPosition;
    }
}