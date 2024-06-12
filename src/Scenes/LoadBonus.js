class LoadBonus extends Phaser.Scene {
    constructor() {
        super("loadBonusScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.audio('jump2', 'Jump2.ogg');

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.tilemapTiledJSON("bonus", "bonus.tmj");   // Tilemap in JSON

        
    }

    create() {
        this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Bonus Level', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        this.scene.start('bonusScene');
    }
}