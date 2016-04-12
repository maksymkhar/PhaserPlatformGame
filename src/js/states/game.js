var playState = {

    preload: function() {

        game.load.image('sky', 'assets/images/sky.png');
        game.load.image('ground', 'assets/images/platform.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('splash_particle', 'assets/images/splash_particle.jpg');
        game.load.image('enemy_1', 'assets/images/enemySpikey_1.png');
        game.load.image('enemy_2', 'assets/images/enemySpikey_2.png');
        game.load.image('enemy_3', 'assets/images/enemySpikey_3.png');
        game.load.image('enemy_4', 'assets/images/enemyFlying_1.png');
        game.load.image('splash_particle', 'assets/images/splash_particle.jpg');
        game.load.image('blod_particle', 'assets/images/blod_particle.png');
        game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);

        game.load.audio('music', ['assets/sounds/music.wav']);
        game.load.audio('jump', ['assets/sounds/jump.wav']);
        game.load.audio('coin', ['assets/sounds/coin.wav']);
        game.load.audio('game_over', ['assets/sounds/game_over_a.wav']);
        game.load.audio('splash', ['assets/sounds/splash.wav']);
        game.load.audio('hurt', ['assets/sounds/hurt.wav']);

        game.load.tilemap('tile_map', 'assets/map/tile_map_level_1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tile_sheet', 'assets/map/tilesheet.png');
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.loadMap();
        this.loadPlayer();
        this.loadStars();
        this.loadSounds();
        this.createModals();
        this.setParticles();
        this.loadEnemies();
        // Load score and lives texts and counters
        this.initCounters();

        // Controls
        this.cursors = game.input.keyboard.createCursorKeys();




        this.immunityTime = 0;



        this.livesTest = game.add.group();
        for (var i = 0; i < 3; i++)
        {



            oneLive = this.livesTest.create(30, game.world.height - 550, 'star');
            oneLive.anchor.setTo(0.5, 0.5);
            oneLive.angle = 90;
            oneLive.alpha = 0.4;
        }


    },
    update: function() {

        game.physics.arcade.collide(this.stars, this.platformsLayer);
        game.physics.arcade.collide(this.player, this.platformsLayer);
        game.physics.arcade.collide(this.enemies, this.platformsLayer);

        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        if (this.immunityTime < (new Date()).getTime()) {
            this.player.tint = 0xffffff;
            game.physics.arcade.overlap(this.player, this.enemies, this.enemyAttack, null, this);
        }

        this.player.body.velocity.x = 0;

        if (this.player.y > 1180 && this.player.alive) {
            this.playerSplashDeath();
        }

        this.inputs();
        this.updateEnemyMovement();
    },

    inputs: function() {

        if (this.player.dead) { return; }

        // Directions
        if (this.cursors.left.isDown)  { this.directionPlayer(-300, 'left'); } // Move to left
        else if (this.cursors.right.isDown) { this.directionPlayer(300, 'right'); }  // Move to right
        else { this.stopPlayer();} // Stop

        // Double jump
        if (this.player.body.onFloor()) {
            this.jumps = 2;
            this.jumping = false;
        }

        if (this.jumps > 0 && this.upInputIsActive(5)) {
            this.jumpPlayer(-420);
            this.jumping = true;
        }

        if (this.jumping && this.upInputIsReleased()) {
            this.jumps--;
            this.jumping = false;
        }
    },

    // Example function!
    jumpPlayer: function(velocity) {
        this.player.body.velocity.y = velocity;
        this.jumpSound.play();
    },
    directionPlayer: function(velocity, animation) {

        this.player.body.velocity.x = velocity;
        this.player.animations.play(animation);
    },
    stopPlayer: function() {
        this.player.animations.stop();
        this.player.frame = 4;
    },
    collectStar: function(player, star) {

        star.body.enable = false;
        game.add.tween(star.scale).to({x:0}, 150).start();
        game.add.tween(star).to({y:-1000}, 150).start();

        this.coinSound.play();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    },
    enemyAttack: function() {

        if (this.player.dead) { return; }

        this.shakeEffect(this.player);
        this.hurt.play();

        if (this.lives > 0) {
            this.lives--;
            this.livesText.text = 'Lives: ' + this.lives;
            this.immunityTime = (new Date()).getTime() + 3000;
            this.player.tint = 0x6efdfd;

            return;
        }

        this.playerBloodDeath();
    },
    loadMap: function() {

        game.stage.backgroundColor = "#4488AA";

        this.map = game.add.tilemap('tile_map');
        this.map.addTilesetImage('tile_map', 'tile_sheet');

        decorationLayer = this.map.createLayer('decoration');
        this.waterLayer = this.map.createLayer('water');
        this.platformsLayer = this.map.createLayer('ground');

        this.waterLayer.resizeWorld();

        this.map.setCollisionBetween(1, 10000, true, 'ground');
    },
    loadPlayer: function() {

        this.player = game.add.sprite(20, game.world.height - 200, 'dude');
        this.player.scale.setTo(1.1, 1.1);

        game.physics.arcade.enable(this.player);
        game.camera.follow(this.player);

        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [0, 1, 2, 3], 20, true);
        this.player.animations.add('right', [5, 6, 7, 8], 20, true);

        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 1200;

        this.player.dead = false;
    },
    loadStars: function () {

        this.stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 30; i++)
        {
            //  Create a star inside of the 'stars' group
            this.star = this.stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            this.star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            this.star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

    },
    loadSounds: function () {

        // Sounds
        this.coinSound = game.add.audio('coin', 1);
        this.jumpSound = game.add.audio('jump', 1);
        this.gameOver = game.add.audio('game_over', 0.6);
        this.splash = game.add.audio('splash', 1);
        this.hurt = game.add.audio('hurt', 1);
        // Music
        this.music = game.add.audio('music', 0.8);
        this.music.loop = true;
        this.music.play();
    },
    upInputIsActive: function(duration) {

        isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);

        isActive |= (game.input.activePointer.justPressed(duration + 1000/60) &&
        game.input.activePointer.x > game.width/4 &&
        game.input.activePointer.x < game.width/2 + game.width/4);

        return isActive;
    },
    upInputIsReleased: function() {

        isReleased = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
        isReleased |= game.input.activePointer.justReleased();

        return isReleased;
    },
    playerDeath: function () {
        this.modal.showModal("game_over_modal");
        this.music.stop();
        this.gameOver.play();
    },
    setParticles: function() {

        this.splashParticles = game.add.emitter(0, 0, 200);
        this.splashParticles.makeParticles('splash_particle');
        this.splashParticles.setYSpeed(-300, 30);
        this.splashParticles.setXSpeed(-80, 80);
        this.splashParticles.gravity = 0;

        this.blodParticles = game.add.emitter(0, 0, 200);
        this.blodParticles.makeParticles('blod_particle');
        this.blodParticles.setYSpeed(-300, 300);
        this.blodParticles.setXSpeed(-300, 300);
        this.blodParticles.gravity = 0;
    },
    playerSplashDeath: function() {

        this.player.kill();
        this.splashParticles.x = this.player.x + 10;
        this.splashParticles.y = this.player.y + 30;
        this.splashParticles.start(true, 600, null, 80);
        this.splash.play();

        this.playerDeath();
        this.player.dead = true;
    },
    playerBloodDeath: function() {

        this.player.kill();
        this.blodParticles.x = this.player.x + 10;
        this.blodParticles.y = this.player.y + 30;
        this.blodParticles.start(true, 600, null, 400);

        this.playerDeath();
        this.player.dead = true;
    },
    loadEnemies: function() {

        this.enemies = game.add.group();
        this.enemies.enableBody = true;

        this.enemy1 = this.enemies.create(400, game.world.height - 220, 'enemy_1');
        this.enemy1.body.gravity.y = 300;
        this.enemy1.body.velocity.x = 40;

        this.enemy2 = this.enemies.create(400, game.world.height - 420, 'enemy_2');
        this.enemy2.body.gravity.y = 300;
        this.enemy2.body.velocity.x = -60;

        this.enemy3 = this.enemies.create(810, game.world.height - 580, 'enemy_2');
        this.enemy3.body.gravity.y = 300;
        this.enemy3.body.velocity.x = 60;

        this.enemy4 = this.enemies.create(1420, game.world.height - 320, 'enemy_1');
        this.enemy4.body.gravity.y = 300;
        this.enemy4.body.velocity.x = 100;

        this.enemy5 = this.enemies.create(2350, game.world.height - 540, 'enemy_3');
        this.enemy5.body.gravity.y = 300;
        this.enemy5.body.velocity.x = 100;

        this.enemy6 = this.enemies.create(2950, game.world.height - 540, 'enemy_4');
        this.enemy6.body.velocity.y = 100;
    },

    updateEnemyMovement: function(){

        if (parseInt(this.enemy1.body.x) > 430 ) { this.enemy1.body.velocity.x = -40; }
        if (parseInt(this.enemy1.body.x) < 360 ) { this.enemy1.body.velocity.x = 40; }

        if (parseInt(this.enemy2.body.x) > 430 ) { this.enemy2.body.velocity.x = -60; }
        if (parseInt(this.enemy2.body.x) < 360 ) { this.enemy2.body.velocity.x = 60; }

        if (parseInt(this.enemy3.body.x) > 1200 ) { this.enemy3.body.velocity.x = -600; }
        if (parseInt(this.enemy3.body.x) < 810 ) { this.enemy3.body.velocity.x = 60; }

        if (parseInt(this.enemy4.body.x) > 1970) { this.enemy4.body.velocity.x = this.getRandomBetween(-50, -800); }
        if (parseInt(this.enemy4.body.x) < 1420 ) { this.enemy4.body.velocity.x = this.getRandomBetween(50, 800); }

        if (parseInt(this.enemy5.body.x) > 2830) { this.enemy5.body.velocity.x = this.getRandomBetween(-100, -400); }
        if (parseInt(this.enemy5.body.x) < 2350 ) { this.enemy5.body.velocity.x = this.getRandomBetween(100, 400); }

        if (parseInt(this.enemy6.body.y) > 900 ) { this.enemy6.body.velocity.y = -600; }
        if (parseInt(this.enemy6.body.y) < 600 ) { this.enemy6.body.velocity.y = 150; }
    },

    initCounters: function() {

        this.score = 0;
        this.scoreText = game.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });
        this.scoreText.fixedToCamera = true;

        this.lives = 3;
        this.livesText = game.add.text(16, 55, 'Lives: ' + this.lives, { fontSize: '32px', fill: '#fff'});
        this.livesText.fixedToCamera = true;
    },

    createModals: function() {

        this.modal = new gameModal(game);

        this.modal.createModal({
            type:"game_over_modal",
            includeBackground: true,
            modalCloseOnInput: false,
            fixedToCamera: true,
            itemsArr: [
                {
                    type: "text",
                    content: "GAME OVER",
                    fontFamily: "Luckiest Guy",
                    fontSize: 50,
                    color: "0xFEFF49",
                    offsetY: -50
                },
                {
                    type: "text",
                    content: "Try again?",
                    fontSize: 30,
                    color: "fff",
                    offsetY: 50
                },
                {
                    type: "text",
                    content: "YES",
                    fontSize: 30,
                    color: "fff",
                    offsetY: 100,
                    offsetX: -80,
                    callback: function () {
                        game.state.restart();
                    }
                },
                {
                    type: "text",
                    content: "NO",
                    fontSize: 30,
                    color: "fff",
                    offsetY: 100,
                    offsetX: 80,
                    callback: function () {
                        // TODO: go to main menu
                    }
                }
            ]
        });
    },
    shakeEffect: function(g) {
        var move = 5;
        var time = 20;

        game.add.tween(g)
            .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
            .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
            .to({y:"-"+move/2}, time).to({y:"+"+move}, time*2).to({y:"-"+move/2}, time)
            .start();

        game.add.tween(g)
            .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
            .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
            .to({x:"-"+move/2}, time).to({x:"+"+move}, time*2).to({x:"-"+move/2}, time)
            .start();
    },
    getRandomBetween: function (start, end) {
        return Math.floor(Math.random() * end) + start;
    }
};