var menu = {

    create: function() {

        game.stage.backgroundColor = "#4488AA";
        game.stage.disableVisibilityChange = true;

        this.setGameTitle();
        this.setGameStartButton();
    },
    setGameTitle: function() {

        this.titleText = game.add.text(game.camera.width / 2, 100, "Phaser Platform Game", {
            font: 'bold 60pt Ubuntu',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
    },
    setGameStartButton: function() {

        this.startText = game.add.text(game.camera.width / 2, 280, "START", {
            font: '30pt Ubuntu',
            fill: '#FFFFFF',
            align: 'center'
        });
        this.startText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.startText.anchor.set(0.5);
        this.startText.inputEnabled = true;
        this.startText.events.onInputUp.add(function () {
            game.state.start('playState');
        });
    }
};