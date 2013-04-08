ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: { x: 16, y: 16 },
        speed: 100,
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 16, 16),

        moveIntention: null,
        lastMove: null,
        destination: null,

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

            if(destination && this.justReachedDestination() && !this.moveIntention) { /* align to grid and stop */ }
            else if(destination && this.justReachedDestination() && this.moveIntention && this.moveIntention === this.lastMove) { /* continue moving same direction */ }
            else if(destination && this.justReachedDestination() && this.moveIntention && this.moveIntention !== this.lastMove) { /* align to grid and start moving in new direction */ }
            else if(destination && !this.justReachedDestination()) { /* continue moving in same direction */ }
            else if(!destination && this.moveIntention && this.canMoveDirection(this.moveIntention)) { /* start moving in direction */ }
            else if(!destination && this.moveIntention && !this.canMoveDirection(this.moveIntention)) { /* do nothing */ }

            var tilesize = ig.game.collisionMap.tilesize;
            if(this.moveIntention === moveType.UP) this.setVelocityByCoord(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 - tilesize, this.speed);
            else if(this.moveIntention === moveType.DOWN) this.setVelocityByCoord(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 + tilesize, this.speed);
            else if(this.moveIntention === moveType.LEFT) this.setVelocityByCoord(this.pos.x + this.size.x/2 - tilesize, this.pos.y + this.size.y/2, this.speed);
            else if(this.moveIntention === moveType.RIGHT) this.setVelocityByCoord(this.pos.x + this.size.x/2 + tilesize, this.pos.y + this.size.y/2, this.speed);
            else this.vel.x = this.vel.y = 0;

            this.parent();
        },

        snapToTile: function(x, y) {
            var tilesize = ig.game.collisionMap.tilesize;
            this.pos.x = x * tilesize;
            this.pos.y = y * tilesize;
        },

        justReachedDestination: function() {
            return (
                ((this.pos.x >= this.destination.x && this.last.x < this.destination.x) || (this.pos.x <= this.destination.x && this.last.x > this.destination.x)) &&
                ((this.pos.y >= this.destination.y && this.last.y < this.destination.y) || (this.pos.y <= this.destination.y && this.last.y > this.destination.y))
            );
        },

        isMoving: function() {
            return destination !== null;
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