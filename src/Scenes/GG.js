class GG extends Phaser.Scene {
    constructor() {
        super("ggScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.audio('click', 'switch1.ogg');
    }

    create() {
        this.clickSFX = this.sound.add('click');

        this.ggText = this.add.text(this.cameras.main.centerX, 150, 'Game Over', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.ggText = this.add.text(this.cameras.main.centerX, 200, 'Score: ' + score, { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.ButtonText = this.add.text(this.cameras.main.centerX, 250, 'Click to Return to Title', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        score = 0;

        this.ButtonText.setInteractive();
        this.ButtonText.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}