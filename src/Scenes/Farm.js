class Farm extends Phaser.Scene {
    constructor() {
        super("farmScene");
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
        this.playerHP = 100;
        this.gameLost = false;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("farm", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");
        this.tilesetFarm = this.map.addTilesetImage("tilemap_packed_farm", "tilemap_tiles_farm");
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        // Create a SFX
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
        //hp system//
        this.HPText = this.add.text(50, 50, "HP:100", {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: 10,
        });

        // Create layers
        this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tilesetFarm, 0, 0);
        this.decorationLayer = this.map.createLayer("Decoration", this.tilesetFarm, 0, 0);
        this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);

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
        //heart
        this.heart = this.map.createFromObjects("Objects", {
            name: "heart",
            key: "tilemap_sheet",
            frame: 44
        });


        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.heartGroup = this.add.group(this.heart);
    

        //set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        //set up patrolling enemy avata//
        my.sprite.enemy = this.physics.add.sprite(100, 250, "platformer_characters", "tile_0002.png");
        my.sprite.enemy.setCollideWorldBounds(true);
        my.sprite.enemy.patrolBounds = { left: 100, right: 180 }; // Define patrol range
        my.sprite.enemy.patrolSpeed = 50; // Speed at which the enemy patrols
        my.sprite.enemy.direction = 1; // Current direction: 1 for right, -1 for left
        this.physics.add.collider(my.sprite.enemy, this.groundLayer);
        
        this.physics.add.overlap(my.sprite.player, my.sprite.enemy, (player, enemy) => {
            enemy.destroy();
            this.sound.play("explode", {
                volume: 0.5   // Can adjust volume using this, goes from 0 to 1
            });
            this.playerHP -= 100;  // Decrease player HP by 10
        });
        //set up enemy avatar2

        //set up patrolling enemy avata2//
        my.sprite.enemy2 = this.physics.add.sprite(200, 370, "platformer_characters", "tile_0018.png");
        my.sprite.enemy2.setCollideWorldBounds(true);
        my.sprite.enemy2.patrolBounds = { left: 150, right: 250 }; // Define patrol range
        my.sprite.enemy2.patrolSpeed = 50; // Speed at which the enemy patrols
        my.sprite.enemy2.direction = 1; // Current direction: 1 for right, -1 for left
        this.physics.add.collider(my.sprite.enemy2, this.groundLayer);

        this.physics.add.overlap(my.sprite.player, my.sprite.enemy2, (player, enemy) => {
            enemy.destroy();
            this.playerHP -= 50;  // Decrease player HP by 10
            
            this.clickSFX.play();

        });
        
        
        // set up key avatar
        this.key = this.physics.add.sprite(30, 300, "key");
        this.key.visible = false;
        this.key.interactable = false;

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(this.key, this.groundLayer);
        
        // Set up texts
        this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#FFFFFF' });
        // this.axisText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 16, 'X: ' + my.sprite.player.x + ' Y: ' + my.sprite.player.y, { fontSize: '12px', fill: '#FFFFFF' });
        this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Collect all coins to spawn the key!', { fontSize: '12px', fill: '#FFFFFF' });

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            score += 100;   // increment score
            this.collectSFX.play();
        });
        this.physics.add.overlap(my.sprite.player, this.heartGroup, (obj1, obj2) => {
            obj2.destroy();
            this.playerHP += 20;
            this.sound.play("heart", {
                volume: 0.5   // Can adjust volume using this, goes from 0 to 1
            });
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
        //enemy range//
        if (my.sprite.enemy && my.sprite.enemy.active) {
            if (my.sprite.enemy.x <= my.sprite.enemy.patrolBounds.left) {
                my.sprite.enemy.direction = 1;  // Turn right
            } else if (my.sprite.enemy.x >= my.sprite.enemy.patrolBounds.right) {
                my.sprite.enemy.direction = -1; // Turn left
            }
            my.sprite.enemy.setVelocityX(my.sprite.enemy.patrolSpeed * my.sprite.enemy.direction);
        }
        if (my.sprite.enemy2 && my.sprite.enemy2.active) {
            if (my.sprite.enemy2.x <= my.sprite.enemy2.patrolBounds.left) {
                my.sprite.enemy2.direction = 1;  // Turn right
            } else if (my.sprite.enemy2.x >= my.sprite.enemy2.patrolBounds.right) {
                my.sprite.enemy2.direction = -1; // Turn left
            }
            my.sprite.enemy2.setVelocityX(my.sprite.enemy2.patrolSpeed * my.sprite.enemy2.direction);
        }
        //game over//
        if(this.playerHP <= 0 && this.gameLost == false){
            this.gameLost = true;
            this.loseText1 = this.add.text(this.cameras.main.worldView.x+240, 130, "You died!", {
                fontFamily: 'Lucida, monospace',
                fontSize: 20,
            });
            this.loseText3 = this.add.text(this.cameras.main.worldView.x+160, 170, "Press R to restart", {
                fontFamily: 'Lucida, monospace',
                fontSize: 20,
            });
            this.physics.pause();
        }
        //hp text//
        this.HPText.setText("HP: " + Math.floor(this.playerHP));
        this.HPText.x = my.sprite.player.x-28;
        this.HPText.y = my.sprite.player.y-45;
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

        // when all coins are collected, spawn the key
        if(this.coinGroup.getLength() === 0) {
            this.key.visible = true;
            this.key.interactable = true;
            if (keycountFarm === 0){
                this.conditionText.setText('The key has spawned somewhere.');
            }
        }

        // key collection
        if(this.key.interactable && Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.player.getBounds(), this.key.getBounds())) {
            this.key.destroy();
            this.conditionText.setText('Congrats! Proceed to the right to the next scene.');
            keycountFarm++;
        }

        // next scene
        if(my.sprite.player.x > this.map.widthInPixels) {
            this.scene.start("loadFoodScene");
        }
    }
}