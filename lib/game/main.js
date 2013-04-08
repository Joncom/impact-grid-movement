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
    font: new ig.Font( 'media/04b03.font.green.png' ),

    init: function() {
        // Bind keys.
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        // Load demo level.
        this.loadLevel(LevelDemo);
    },

    update: function() {
        this.parent();
    },

    draw: function() {
        this.parent();

        var x = ig.system.width/2;
        var y = ig.system.height/2;
        this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
    }
});

ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
