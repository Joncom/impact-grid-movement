ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'game.levels.demo'
)
.defines(function(){

MyGame = ig.Game.extend({

    // Load a font
    font: new ig.Font( 'media/04b03.font.png' ),

    init: function() {

        // Bind keys.
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.W, 'up');
        ig.input.bind(ig.KEY.S, 'down');
        ig.input.bind(ig.KEY.A, 'left');
        ig.input.bind(ig.KEY.D, 'right');

        // Load demo level.
        this.loadLevel(LevelDemo);
    },

    draw: function() {

        this.parent();

        // Give instructions.
        var x = ig.system.width/2;
        var y = ig.system.height - this.font.height - 2;
        this.font.draw( 'Use the ARROW KEYS to move around.', x, y, ig.Font.ALIGN.CENTER );
    }
});

ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
