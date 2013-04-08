ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: { x: 16, y: 16 },
        speed: 100,
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 16, 16),
        moveIntention: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('default', 1, [0]);
        },

        update: function() {

            // Set movement intention based on input.
            this.moveIntention = null; // clear old move input
            if(ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) this.moveIntention = moveIntentionType.UP;
            else if(!ig.input.state('up') && ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) this.moveIntention = moveIntentionType.DOWN;
            else if(!ig.input.state('up') && !ig.input.state('down') && ig.input.state('left') && !ig.input.state('right')) this.moveIntention = moveIntentionType.LEFT;
            else if(!ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && ig.input.state('right')) this.moveIntention = moveIntentionType.RIGHT;

            this.parent();
        },

        // Returns true if a tile is walkable. Else returns false.
        canWalkOnTile: function(x, y) {
            return ig.game.collisionMap.data[y][x] === 0;
        },

        // Sets the velocity of the entity so that it will move toward the coordinate.
        setVelocityByCoord: function(x, y, velocity) {
            var distance_x = x - (this.pos.x + this.size.x/2);
            var distance_y = y - (this.pos.y + this.size.y/2);
            this.vel.x = (distance_x >= 0 ? 1 : -1) * velocity * (Math.abs(distance_x) / (Math.abs(distance_x) + Math.abs(distance_y)));
            this.vel.y = (distance_y >= 0 ? 1 : -1) * velocity * (Math.abs(distance_y) / (Math.abs(distance_x) + Math.abs(distance_y)));
        }

    });

    var moveIntentionType = {
        'UP': 1,
        'DOWN': 2,
        'LEFT': 4,
        'RIGHT': 8
    };

});