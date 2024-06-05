class LoadIndustrial extends Phaser.Scene {
    constructor() {
        super("loadIndustrialScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles_background", "tilemap-backgrounds_packed.png"); // Packed backgrounds tilemap
        this.load.image("tilemap_tiles_industrial", "tilemap_packed_industrial.png");  // Packed industrial tilemap

        this.load.tilemapTiledJSON("industrial", "industrial.tmj");   // Tilemap in JSON

        // this tilemap is used for the background
        this.load.spritesheet("tilemap_sheet_background", "tilemap-backgrounds_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Load the tilemap as a spritesheet for the industrial scene
        this.load.spritesheet("tilemap_sheet_industrial", "tilemap_packed_industrial.png", {
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
        this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Level-3: Industrial...', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        this.scene.start('industrialScene');
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}