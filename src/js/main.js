
var game;


game = new Phaser.Game(900, 500, Phaser.AUTO, 'Game');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality

game.state.add('menu', menu);
game.state.add('playState', playState);
game.state.start('playState');
