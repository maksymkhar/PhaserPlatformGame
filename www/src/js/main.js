
var game;


//game = new Phaser.Game(5000, 1500, Phaser.AUTO, 'Game');
game = new Phaser.Game(900, 500, Phaser.AUTO, 'Game');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality

game.state.add('menu', menu);
game.state.add('levelPassed', levelPassed);
game.state.add('gameWin', gameWin);
game.state.add('playStateLevel1', playStateLevel1);
game.state.add('playStateLevel2', playStateLevel2);
game.state.start('menu');
