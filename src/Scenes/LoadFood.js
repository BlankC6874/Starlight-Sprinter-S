class LoadFood extends Phaser.Scene {
    constructor() {
        super("loadFoodScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.audio('jump1', 'Jump1.ogg');
        this.load.audio('jump2', 'Jump2.ogg');

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles_background", "tilemap-backgrounds_packed.png"); // Packed backgrounds tilemap
        this.load.image("tilemap_tiles_food", "tilemap_packed_food.png");             // Packed food tilemap

        this.load.tilemapTiledJSON("food", "food.tmj");   // Tilemap in JSON

        // this tilemap is used for the background
        this.load.spritesheet("tilemap_sheet_background", "tilemap-backgrounds_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Load the tilemap as a spritesheet for the food scene
        this.load.spritesheet("tilemap_sheet_food", "tilemap_packed_food.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        // this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Level-2: Food...', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        
        // this.anims.create({
            // key: 'walk',
            // frames: this.anims.generateFrameNames('platformer_characters', {
                // prefix: "tile_",
                // start: 0,
                // end: 1,
                // suffix: ".png",
                // zeroPad: 4
            // }),
            // frameRate: 15,
            // repeat: -1
        // });

        // this.anims.create({
            // key: 'idle',
            // defaultTextureKey: "platformer_characters",
            // frames: [
                // { frame: "tile_0000.png" }
            // ],
            // repeat: -1
        // });

        // this.anims.create({
            // key: 'jump',
            // defaultTextureKey: "platformer_characters",
            // frames: [
                // { frame: "tile_0001.png" }
            // ],
        // });

        // Start the next scene
        this.scene.start("foodScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}