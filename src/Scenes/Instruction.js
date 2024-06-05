class Instruction extends Phaser.Scene {
    constructor() {
        super("instructionScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('click', 'switch1.ogg');
    }

    create() {
        this.clickSFX = this.sound.add('click');
        this.add.text(this.cameras.main.centerX, 150, 'Instructions', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 250, '1. Use arrow keys to control player avatars movement', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 300, '2. Collect coins and gas by moving players avatar to make a touch', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 350, '3. To higher your score (as you see above the avatar), please collect as much as possible', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 400, '4. Once you move to the next scene during the game, you cannot retrieve to the last scene', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 450, '5. Enjoy the Game!', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        
        this.returnButton = this.add.text(this.cameras.main.centerX, 550, 'Click Here to Return to Title', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        this.returnButton.setInteractive();
        this.returnButton.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}