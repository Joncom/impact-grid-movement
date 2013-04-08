ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: { x: 16, y: 16 },
        speed: 100,
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 16, 16),
        moveIntention: null,
        currentMove: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('default', 1, [0]);
        },

        update: function() {

            // Set movement intention based on input.
            this.moveIntention = null; // clear old move input
            if(ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) this.moveIntention = moveType.UP;
            else if(!ig.input.state('up') && ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) this.moveIntention = moveType.DOWN;
            else if(!ig.input.state('up') && !ig.input.state('down') && ig.input.state('left') && !ig.input.state('right')) this.moveIntention = moveType.LEFT;
            else if(!ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && ig.input.state('right')) this.moveIntention = moveType.RIGHT;

            var tilesize = ig.game.collisionMap.tilesize;
            if(this.moveIntention === moveType.UP) this.setVelocityByCoord(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 - tilesize, this.speed);
            else if(this.moveIntention === moveType.DOWN) this.setVelocityByCoord(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 + tilesize, this.speed);
            else if(this.moveIntention === moveType.LEFT) this.setVelocityByCoord(this.pos.x + this.size.x/2 - tilesize, this.pos.y + this.size.y/2, this.speed);
            else if(this.moveIntention === moveType.RIGHT) this.setVelocityByCoord(this.pos.x + this.size.x/2 + tilesize, this.pos.y + this.size.y/2, this.speed);
            else this.vel.x = this.vel.y = 0;

            /*
            // Is the player already moving?
            if(this.currentMove) {
                // Does the player intend to continue moving this way?
                if(this.moveIntention === this.currentMove) {

                }
            }
            // Is the player currently idle?
            else if(!this.currentMove) {
                // Does the player intend to move?
                if(this.moveIntention) {
                    // Can the player move where he wants to go?
                    var tilesize = ig.game.collisionMap.tilesize;
                    var posX = this.pos.x;
                    posX += ( this.moveIntention === moveType.LEFT ? -tilesize : 0 );
                    posX += ( this.moveIntention === moveType.RIGHT ? tilesize : 0 );
                    var posY = this.pos.x / tilesize;
                    posY += ( this.moveIntention === moveType.UP ? -tilesize : 0 );
                    posY += ( this.moveIntention === moveType.DOWN ? tilesize : 0 );
                    var tileX = posX / tilesize;
                    var tileY = posY / tilesize;
                    if(this.canWalkOnTile(tileX, tileY)) {
                        this.currentMove = this.moveIntention;
                        this.setVelocityByCoord(posX, posY, this.speed);
                    }
                }
            }
            */


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

    var moveType = {
        'UP': 1,
        'DOWN': 2,
        'LEFT': 4,
        'RIGHT': 8
    };

});