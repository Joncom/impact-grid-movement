ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: { x: 16, y: 16 },
        speed: 100,
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('default', 1, [0]);
        },

        update: function() {
            this.parent();
        }

    });

});