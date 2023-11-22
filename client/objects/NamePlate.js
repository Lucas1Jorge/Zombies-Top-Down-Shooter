class Nameplate {
    constructor(playerName, playerPosition) {
      this.playerName = playerName;
      this.playerPosition = playerPosition;
    }
  
    draw() {
      // Draw the nameplate to the screen
      context.fillStyle = 'black';
      context.font = '12px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this.playerName, this.position.x, this.position.y);
    }

    update() {
        // Update the nameplate's position to follow the player
        this.position = this.playerPosition.add(new Vector2(0, -10)); // Offset the nameplate slightly above the player's head
    }
  }