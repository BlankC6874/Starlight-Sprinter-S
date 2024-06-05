class Title extends Phaser.Scene {
  constructor() {
    super("titleScene");
  }

  preload() {
    this.load.setPath("./assets/");

    this.load.audio('click', 'switch1.ogg');
  }

  create() {
    this.clickSFX = this.sound.add('click');

    this.titleText = this.add.text(this.cameras.main.centerX, 150, 'Starlight Sprinter', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);

    this.startGameButton = this.add.text(this.cameras.main.centerX, 250, 'Click to Start New Game', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.creditsButton = this.add.text(this.cameras.main.centerX, 300, 'Click for Credits', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.instructionButton = this.add.text(this.cameras.main.centerX, 350, 'Click for Instructions', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    this.startGameButton.setInteractive();
    this.startGameButton.on('pointerdown', () => {
        this.scene.start('loadFarmScene');
        this.clickSFX.play();
    });

    this.creditsButton.setInteractive();
    this.creditsButton.on('pointerdown', () => {
        this.scene.start('creditsScene');
        this.clickSFX.play();
    });

    this.instructionButton.setInteractive();
    this.instructionButton.on('pointerdown', () => {
        this.scene.start('instructionScene');
        this.clickSFX.play();
    });
  }
}