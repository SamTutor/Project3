/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
        startgame = false;
        nextlevel = false;
        dt = 0, // initializez the a time delta between ticks
        numRows = 7, // Set the number of Rows for the Game Board
        numCols = 5, // Set the number of Columns for the Game Board
        //Randomizes the Stone Block that the player must reach to win the game
        randcol= (Math.floor ( Math.random() * (numCols) ) ),
        // initializes the variables needed for the random Gems that tha player can capture
        captureGem = 'no';
        maxx = 0, minx = 384, maxy = 482, miny = 162,
        GemX = (Math.floor ( (Math.random() * (maxx - minx)) + minx) ),
        GemY = (Math.floor ( (Math.random() * (maxy - miny)) + miny) ),
        // initializes the Level variable that will keep track of which level the player is on
        levnum = 1,
        // initialized the Jewel variable that will keep track of the number of Jems the player has
        jwlnum = 0,
        // Randomize the type of Gems that you can obtain during the game   
        numGem = 4,
        randgem = (Math.floor ( Math.random() * numGem ) );

    // Sets the Dimensions of the GameScreen Canvas
    canvas.width = 505;
    canvas.height = 707;
    doc.getElementById('canvasDiv').appendChild(canvas);
     

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
         dt = (Date.now() - lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = Date.now();
       /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if (startgame) {win.requestAnimationFrame(main)};
    };


    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }


    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        captured();
        updateEntities(dt);
    }


    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        checkCollisions();
        
    }

    
    /* This function is called to determine if the player has captured a Gem or not */
    function captured() {    
        // Sprite used to show the Gem has already been captured
        this.sprite ="images/CapturedGem.png";  
        // Determines if the player has captured the jewel from the Game screen
        if ((playerx == GemX) && (playery == GemY)) {
            console.log(playerx, GemX, playery, GemY);
            captureGem = 'yes';            
        } 
    }


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 4 of 2 of grass
            'images/grass-block.png',   // Row 5 of 2 of grass
            'images/nextlevel-block.png'

            ],         
            row, col;
        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                if (row == 0) {
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
                else {            
                    if (col == randcol) {
                        if (row == 1) { 
                            //This draws the next level block that the player must enter in order to go to the next level
                            ctx.drawImage(Resources.get(rowImages[7]), col * 101, row * 83);
                            //This is draw a message to indicate that this is where the player must go to advance to the next level 
                            ctx.font = "10px Arial ";   
                            ctx.fillStyle = "WHITE";   
                            ctx.fillText("GO TO", col*107,row*103);
                            ctx.fillText("NEXT LEVEL", col*107 ,row*113);     
                        }
                        else {   
                            ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                        } 
                    }
                    else {
                        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                    }
                }
            }
        }

    // Different Type of Gems stored in a array
    var gemImages = [
            'images/GemOrange.png',   
            'images/GemBlue.png',
            'images/GemPurple.png', 
            'images/GemNeon.png'];
    // Align Gems to game and player grid
    if ((GemX % 64) < 64) {
        GemX = GemX - (GemX % 64);}
    if ((GemY % 64) < 64) {
        GemY = GemY - (GemY % 64)+34;}    
    // Draw the Gem(s) on the screen
    ctx.drawImage(Resources.get(gemImages[randgem]), GemX, GemY);
    // Render the Enemies and Player
    renderEntities();
    }

   
    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        /* Render the player*/ 
        player.render();
        /* Render the Level of the Game etc.*/ 
        level();
        if (captureGem == 'yes')
           {ctx.drawImage(Resources.get(this.sprite), GemX, GemY);}
        
    }


    /* Displays the Level Information and Number of Jewels obtained */
    function level () {
        ctx.fillStyle = "BLACK";
        ctx.font = "30px Arial";   
        ctx.fillText("LEVEL "+levnum, 10 ,30);
        ctx.font = "20px Arial"; 
        ctx.fillText("JEWELS "+jwlnum, 300, 30)     
    }


    /* This function reset the game */
    function reset() {
        randcol= (Math.floor ( Math.random() * (numCols) ) );
        randgem = (Math.floor ( Math.random() * numGem ) );
        GemX = (Math.floor ( (Math.random() * (maxx - minx)) + minx) );
        GemY = (Math.floor ( (Math.random() * (maxy - miny)) + miny) );
        captureGem='no';
        global.startgame = true;
        allEnemies.forEach(function(enemy) {
           enemy.reset();
        });
        player.reset();
        main();
    }


    /* This function goes to the next level */
    function levelup() {
        // accounts for the captured Gems and then resets the captureGem to no for the next level
        if (captureGem == 'yes')
        {jwlnum = jwlnum+1; captureGem='no';}
        // account for the level the player has advanced to 
        levnum=levnum+1;
        //updates & draws the number of Jewels obtained
        ctx.clearRect(385,15,75,25);
        //updates & draws the current Level the player is on
        ctx.clearRect(105,15,75,25);
        level();
        reset();
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        //Load the Different Types of Game Backgrounds 
        'images/water-block.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/nextlevel-block.png',
         //Load the Different Types of Enemies 
        'images/enemy-bug.png',
        'images/green-enemy-bug.png',
        'images/purple-enemy-bug.png',
        'images/invert-enemy-bug.png',
        'images/enemy-ock.png',      
        //Load the Different Types of Players 
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        //Load the Different Types of Gems 
        'images/GemOrange.png',
        'images/GemBlue.png',
        'images/GemNeon.png',
        'images/GemPurple.png',
        'images/CapturedGem.png',
        //Load mini version of the Players to be able to select from  
        'images/mini-char-boy.png',
        'images/mini-char-cat-girl.png',
        'images/mini-char-horn-girl.png',
        'images/mini-char-pink-girl.png',
        'images/mini-char-princess-girl.png'
    ]);
    Resources.onReady(init);
    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.reset = reset;
    global.levelup = levelup;
    global.main = main;
    global.ctx = ctx;
    global.nextlevel = nextlevel;
    global.startgame = startgame;
})(this);
