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

            // Give the player the appearance that he has.
            this.addAnim('default', 1, [0]);

            // Set speed as the max velocity.
            this.maxVel.x = this.maxVel.y = this.speed;
        },

        update: function() {

            // It's important that this call occur before the movement code below,
            // because otherwise you would sometimes see the entity move past his
            // destination slightly just before snapping back into place.
            this.parent();

            // Set movement intention based on input.
            this.moveIntention = null; // clear old move input
            if(ig.input.state('right')) this.moveIntention = moveType.RIGHT;
            else if(ig.input.state('left')) this.moveIntention = moveType.LEFT;
            else if(ig.input.state('up')) this.moveIntention = moveType.UP;
            else if(ig.input.state('down')) this.moveIntention = moveType.DOWN;

            // Stop the moving entity if at the destination.
            if(this.isMoving() && this.justReachedDestination() && !this.moveIntention) {
                this.stopMoving();
            }
            // Stop the moving entity when it hits a wall.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    !this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention)) {
                this.stopMoving();
            }
            // Destination reached, but set new destination and keep going.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) &&
                    this.moveIntention === this.lastMove) {
                this.continueMovingFromDestination();
            }
            // Destination reached, but changing direction and continuing.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) &&
                    this.moveIntention !== this.lastMove) {
                this.changeDirectionAndContinueMoving(this.moveIntention);
            }
            // Destination not yet reached, so keep going.
            else if(this.isMoving() && !this.justReachedDestination()) {
                this.continueMovingToDestination();
            }
            // Not moving, but wanting to, so start!
            else if(!this.isMoving() && this.moveIntention &&
                    this.canMoveDirectionFromCurrentTile(this.moveIntention)) {
                this.startMoving(this.moveIntention);
            }

        },

        getCurrentTile: function() {
            var tilesize = ig.game.collisionMap.tilesize;
            var tileX = this.pos.x / tilesize;
            var tileY = this.pos.y / tilesize;
            return { x: tileX, y: tileY };
        },

        getTileAdjacentToTile: function(tileX, tileY, direction) {
            if(direction === moveType.UP) tileY += -1;
            else if(direction === moveType.DOWN) tileY += 1;
            else if(direction === moveType.LEFT) tileX += -1;
            else if(direction === moveType.RIGHT) tileX += 1;
            return { x: tileX, y: tileY };
        },

        startMoving: function(direction) {
            // Get current tile position.
            var currTile = this.getCurrentTile();
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
            // Remember this move for later.
            this.lastMove = direction;
        },

        continueMovingToDestination: function() {
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        continueMovingFromDestination: function() {
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, this.lastMove);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        changeDirectionAndContinueMoving: function(newDirection) {
            // Method only called when at destination, so snap to it now.
            this.snapToTile(this.destination.x, this.destination.y);
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
            // Remember this move for later.
            this.lastMove = newDirection;
        },

        stopMoving: function() {
            // Method only called when at destination, so snap to it now.
            this.snapToTile(this.destination.x, this.destination.y);
            // We are already at the destination.
            this.destination = null;
            // Stop.
            this.vel.x = this.vel.y = 0;
        },

        snapToTile: function(x, y) {
            var tilesize = ig.game.collisionMap.tilesize;
            this.pos.x = x * tilesize;
            this.pos.y = y * tilesize;
        },

        justReachedDestination: function() {
            var tilesize = ig.game.collisionMap.tilesize;
            var destinationX = this.destination.x * tilesize;
            var destinationY = this.destination.y * tilesize;
            var result = (
                (this.pos.x >= destinationX && this.last.x < destinationX) ||
                (this.pos.x <= destinationX && this.last.x > destinationX) ||
                (this.pos.y >= destinationY && this.last.y < destinationY) ||
                (this.pos.y <= destinationY && this.last.y > destinationY)
            );
            return result;
        },

        isMoving: function() {
            return this.destination !== null;
        },

        canMoveDirectionFromTile: function(tileX, tileY, direction) {
            var newPos = this.getTileAdjacentToTile(tileX, tileY, direction);
            return ig.game.collisionMap.data[newPos.y][newPos.x] === 0;
        },

        canMoveDirectionFromCurrentTile: function(direction) {
            var currTile = this.getCurrentTile();
            return this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
        },

        // Sets the velocity of the entity so that it will move toward the tile.
        setVelocityByTile: function(tileX, tileY, velocity) {
            var tilesize = ig.game.collisionMap.tilesize;
            var tileCenterX = tileX * tilesize + tilesize/2;
            var tileCenterY = tileY * tilesize + tilesize/2;
            var entityCenterX = this.pos.x + this.size.x / 2;
            var entityCenterY = this.pos.y + this.size.y / 2;
            this.vel.x = this.vel.y = 0;
            if(entityCenterX > tileCenterX) this.vel.x = -velocity;
            else if(entityCenterX < tileCenterX) this.vel.x = velocity;
            else if(entityCenterY > tileCenterY) this.vel.y = -velocity;
            else if(entityCenterY < tileCenterY) this.vel.y = velocity;
        }

    });

    var moveType = {
        'UP': 1,
        'DOWN': 2,
        'LEFT': 4,
        'RIGHT': 8
    };

});