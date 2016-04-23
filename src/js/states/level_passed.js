var levelPassed = {

    preload: function() {
        game.load.audio('level_passed_music', ['assets/sounds/level_passed_music.wav']);
    },

    create: function() {

        game.stage.backgroundColor = "#000000";
        game.stage.disableVisibilityChange = true;

        this.levelPassedMusic = game.add.audio('level_passed_music', 1);
        this.levelPassedMusic.play();


        this.setGameTitle();
        this.setGameStartButton();
    },
    setGameTitle: function() {

        this.titleText = game.add.text(game.camera.width / 2, 100, "LEVEL PASSED!", {
            font: 'bold 60pt Ubuntu',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
    },
    setGameStartButton: function() {

        this.startText = game.add.text(game.camera.width / 2, 280, "NEXT LEVEL", {
            font: '30pt Ubuntu',
            fill: '#FFFFFF',
            align: 'center'
        });
        this.startText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.startText.anchor.set(0.5);
        this.startText.inputEnabled = true;
        this.startText.events.onInputUp.add(function () {
            game.state.start('playStateLevel2');
        });
    }
};