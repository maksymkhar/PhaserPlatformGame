var gameWin = {

    preload: function() {
        game.load.audio('game_win_music', ['assets/sounds/win_music.wav']);
    },

    create: function() {

        game.stage.backgroundColor = "#000000";
        game.stage.disableVisibilityChange = true;

        this.winMusic = game.add.audio('game_win_music', 1);
        this.winMusic.play();


        this.setGameTitle();
        this.setGameStartButton();
    },
    setGameTitle: function() {

        this.titleText = game.add.text(game.camera.width / 2, 100, "THE END", {
            font: 'bold 60pt Ubuntu',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
    },
    setGameStartButton: function() {

        this.startText = game.add.text(game.camera.width / 2, 280, "MENU", {
            font: '30pt Ubuntu',
            fill: '#FFFFFF',
            align: 'center'
        });
        this.startText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.startText.anchor.set(0.5);
        this.startText.inputEnabled = true;
        this.startText.events.onInputUp.add(function () {
            game.state.start('menu');
        });
    }
};