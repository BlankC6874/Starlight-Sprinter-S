class Bonus extends Phaser.Scene {
    constructor() {
        super("bonusScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.jumpCount = 0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("bonus", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_sheet");

        // Create Collect SFX
        this.collectSFX = this.sound.add('collect');
        // Create Jump SFX
        this.jump2SFX = this.sound.add('jump2');
        // Jump vfx
        this.jumpEmitter = this.add.particles(0, 0, "kenny-particles", {
            frame: ['trace_05.png', 'trace_06.png'],
            scale: { start: 0.3, end: 0.1 },
            maxAliveParticles: 200,
            lifespan: 500,
            alpha: { start: 1, end: 0.1 },
            on: false
        });
        this.jumpEmitter.stop(); 

        // Create layers
        this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.decorationLayer = this.map.createLayer("Decoration", this.tileset, 0, 0);


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 300, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        
        // Set up texts
        // color for black: #000000
        this.welcomeText = this.add.text(50, 100, 'Welcome to the Bonus Level gifted by your 3 different keys you collected!', { fontSize: '12px', fill: '#000000' });

        this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#000000' });
        // this.axisText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 16, 'X: ' + my.sprite.player.x + ' Y: ' + my.sprite.player.y, { fontSize: '12px', fill: '#FFFFFF' });
        this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Endless Coins!', { fontSize: '12px', fill: '#000000' });

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            score += 100;   // increment score
            this.collectSFX.play();
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        // this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        // }, this);

        // movement vfx
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            random: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        // Set up camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
    }

    update() {
        // score update
        this.scoreText.setText(score);
        this.scoreText.x = my.sprite.player.x - 15;
        this.scoreText.y = my.sprite.player.y - 26;

        // axis update
        // this.axisText.setText('X: ' + my.sprite.player.x + ' Y: ' + my.sprite.player.y);
        // this.axisText.x = my.sprite.player.x - 15;
        // this.axisText.y = my.sprite.player.y - 16;

        // condition update
        this.conditionText.x = my.sprite.player.x - 20;
        this.conditionText.y = my.sprite.player.y - 36;

        // player movement
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // add particles
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
            

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // add particles
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (my.sprite.player.body.blocked.down) {
            this.jumpCount = 0;  // Reset jump count
            this.jumpEmitter.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpCount++;
            this.jump2SFX.play();

            my.sprite.player.anims.play('jump');
            this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
            this.jumpEmitter.start();
        } else {
            this.jumpEmitter.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        // next scene
        if(my.sprite.player.x > this.map.widthInPixels) {
            this.scene.start("ggScene");
        }
    }
}