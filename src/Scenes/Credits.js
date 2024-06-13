class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        this.load.setPath("./assets/");
    
        this.load.audio('click', 'switch1.ogg');
      }

    create() {
        this.clickSFX = this.sound.add('click');

        this.creditsText = this.add.text(this.cameras.main.centerX, 150, 'Credits', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.creditsText = this.add.text(this.cameras.main.centerX, 250, 'Game Design:', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.creditsText = this.add.text(this.cameras.main.centerX, 300, 'Guangyang Chen, Jinghang Li,Shuhao Lu', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.creditsText = this.add.text(this.cameras.main.centerX, 350, 'gchen79@ucsc.edu, jli758@ucsc.edu, slu51@ucsc.edu', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        
        this.returnButton = this.add.text(this.cameras.main.centerX, 450, 'Click Here to Return to Title', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        this.returnButton.setInteractive();
        this.returnButton.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}
