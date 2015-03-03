// Enemies our player must avoid
var enemy = function(x,y) {
    // Variables applied to enemy
    this.x = x || 0;
    this.y = y || 0;
    this.xInit = this.x;
    this.yInit = this.y;
    // Different Type of Enemies stored in a array
    enemyImages = [
            'images/enemy-bug.png',   
            'images/green-enemy-bug.png',   
            'images/purple-enemy-bug.png',   
            'images/invert-enemy-bug.png',
            'images/enemy-ock.png'];
    // Randomize the type of Enemies that you avoid during the game 
    randenemy= (Math.floor ( Math.random() * (enemyImages.length) ) );
    // The image/sprite for our enemies that will be loaded
    this.sprite = enemyImages[randenemy];
    // Randomizes the speed(s) of each of the enemies
    this.velocity = Math.floor(Math.random()*(121)+100); 
}


// Update the enemy's position
// Parameter: dt, a time delta between ticks
enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= ctx.canvas.width) {
        this.x += (this.velocity*dt);
    }
    else {
        this.x = -Resources.get(this.sprite).width;
    }    
};


// Draw the enemies on the screen
enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Resets the enemy on the screen,
enemy.prototype.reset = function() {
    this.x = this.xInit;
    this.y = this.yInit;
}


// The Player of the Game
var player = function(x, y, stepx, stepy) {
    // Variables applied to player
    this.x = x || 0;
    this.y = y || 0;
    this.Stepx = stepx || 0;
    this.Stepy = stepy || 0;
    this.xInit = this.x;
    this.yInit = this.y;
    this.speed = 256;
    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';
}


// Update the player's position
player.prototype.update = function() {
    playerx = this.x;
    playery = this.y;   
};


// Draw the player on the screen
player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Resets the platyer on the screen
player.prototype.reset = function() {
    this.x = this.xInit;
    this.y = this.yInit;
}


// Allows the platyer to move 
player.prototype.handleInput = function(kc) {
    var movement = .25, numa = 0, numb = 1, nmbr = 1;
       
    // This refines the space the player needs to win the game   
    if (randcol == 0) {// If the block is on the first column
       nmbr = -1;}
    if (randcol == 1) {// If the block is on the second column
        numa = -.1;}
    if (randcol == 3) {// If the block is on the third column
        numa = 1;
        numb = 2;}
    if (randcol == 4) {// If the block is on the fourth column
        numa = 1;
        numb = 2;}
    
    switch (true) {
        case (kc === 'up'):
            // keeps the player from going into the water
            if ( (this.y <= 100) && (this.x <= ((randcol+numa)*64)+nmbr) ) {
                this.y = this.y;}
            else if ( (this.y <= 100) && (this.x >= ((randcol+numb)*64)+nmbr) ) {
                this.y = this.y;}
            // keeps the player from going out of the screen
            else if (this.y <= 75) {
                this.y = this.y;
                levelup();}
            else {
                this.y -= this.speed * movement;}
            break;
        case (kc === 'down'):
            // keeps the player from going out of the screen
            if (this.y >= 425) {
                this.y = this.y;}
            else {
                this.y += this.speed * movement;}
            break;
        case (kc === 'left'):
            // keeps the player from going into the water
            if (this.y <= 75) {
                this.x = this.x;}
            // keeps the player from going out of the screen
            else if (this.x <= 25) { 
                this.x = this.x;}
            else {
                this.x -= this.speed * movement;}
            break
        case (kc === 'right'):
            // keeps the player from going into the water
            if (this.y <= 75) {
                this.x = this.x;}
            // keeps the player from going out of the screen
            else if (this.x >= 375) { 
                this.x = this.x;}
            else {
                this.x += this.speed * movement;}
            break;  
    }
};


// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
var allEnemies = [new enemy(0,(72*2)), new enemy(0,((76*3))), new enemy(0,((78*4)))];

// Place the player object in a variable called player
var player = new player(0,482,101,83);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// This determined if the player has collided with one of the enemies
var playerx = 0, playery = 0, GemPrizes=0; 
var captured = 'no';
var checkCollisions = function() {
    allEnemies.forEach (function(enemy) {
        if ((playery-10 <= enemy.y) && (playery >=enemy.y-60)) {
            if (enemy.x <= playerx) {
                if ( (playerx-enemy.x) <= 15) {
                player.reset();
                }
            }
        
        }
    })

  
}


// Add the ability for user to change the player character sprite via radio button selection
var changeChar = function() {
    player.sprite="images/" + this.value;
    this.blur();
    player.render();
};

var radios = document.getElementsByName('gameChar');

for(var i = radios.length; i--; ) {
    radios[i].onclick = changeChar;
}



// This controls the START/RESET BUTTON of the game
window.onload = function () {
    // START BUTTON starts the game
    document.getElementById("Start_Game").addEventListener("click",
    function(e) {
        console.log("Start Game clicked");
        reset();
    }
    ,false);
};

