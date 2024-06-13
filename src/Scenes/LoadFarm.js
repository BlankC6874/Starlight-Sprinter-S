class LoadFarm extends Phaser.Scene {
    constructor() {
        super("loadFarmScene");
    }

    preload() {
        this.load.setPath("./assets/");
        
        // Load audio files
        this.load.audio('jump2', 'Jump2.ogg');
        this.load.audio('collect', 'impactMetal_light_003.ogg');
        this.load.audio("explode", "explode.ogg");
        this.load.audio("heart", "heart.ogg");
    
        // Load "key" image
        this.load.image("key", "tile_0027.png");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles_background", "tilemap-backgrounds_packed.png"); // Packed backgrounds tilemap
        this.load.image("tilemap_tiles_farm", "tilemap_packed_farm.png");             // Packed farm tilemap
        this.load.image("tilemap_tiles", "tilemap_packed.png");                       // Packed regular tilemap
        
        this.load.tilemapTiledJSON("farm", "farm.tmj");   // Tilemap in JSON
        
        // this tilemap is used for the background
        this.load.spritesheet("tilemap_sheet_background", "tilemap-backgrounds_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Load the tilemap as a spritesheet for the farm scene
        this.load.spritesheet("tilemap_sheet_farm", "tilemap_packed_farm.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // this tilemap is used for coins and water
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Level-1: Farm...', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        // ...and pass to the next Scene
        this.scene.start("farmScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}