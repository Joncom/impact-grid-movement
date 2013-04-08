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

            // Stop the moving entity if at the destination.
            if(this.destination && this.justReachedDestination() && !this.moveIntention) this.stopMoving();
            // Stop the moving entity when it hits a wall.
            else if(this.destination && this.justReachedDestination() && this.moveIntention && !this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention)) this.stopMoving();
            else if(this.destination && this.justReachedDestination() && this.moveIntention && this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) && this.moveIntention === this.lastMove) this.continueMovingFromDestination();
            else if(this.destination && this.justReachedDestination() && this.moveIntention && this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) && this.moveIntention !== this.lastMove) this.changeDirectionAndContinueMoving(this.moveIntention);
            else if(this.destination && !this.justReachedDestination()) { this.continueMovingToDestination(); }
            else if(!this.destination && this.moveIntention && this.canMoveDirectionFromCurrentTile(this.moveIntention)) this.startMoving(this.moveIntention);
            else if(!this.destination && this.moveIntention && !this.canMoveDirectionFromCurrentTile(this.moveIntention)) { /* do nothing */ }

            /*
            var tilesize = ig.game.collisionMap.tilesize;
            if(this.moveIntention === moveType.UP) this.setVelocityByCoord(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 - tilesize, this.speed);
            else if(this.moveIntention === moveType.DOWN) this.setVelocityByCoord(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 + tilesize, this.speed);
            else if(this.moveIntention === moveType.LEFT) this.setVelocityByCoord(this.pos.x + this.size.x/2 - tilesize, this.pos.y + this.size.y/2, this.speed);
            else if(this.moveIntention === moveType.RIGHT) this.setVelocityByCoord(this.pos.x + this.size.x/2 + tilesize, this.pos.y + this.size.y/2, this.speed);
            else this.vel.x = this.vel.y = 0;
            */

            this.parent();
        },

        getTilePos: function() {
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
            console.log('started moving in direction: ' + direction);
            // Get current tile position.
            var tilePos = this.getTilePos();
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(tilePos.x, tilePos.y, direction);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        continueMovingToDestination: function() {
            console.log('continuing to move toward destination.');
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
        },

        stopMoving: function() {
            console.log('just stopped moving.');
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
                (this.pos.x >= destinationX && this.last.x < destinationX) || (this.pos.x <= destinationX && this.last.x > destinationX) ||
                (this.pos.y >= destinationY && this.last.y < destinationY) || (this.pos.y <= destinationY && this.last.y > destinationY)
            );
            if(result) console.log('just reached destination.');
            return result;
        },

        isMoving: function() {
            return destination !== null;
        },

        // Returns true if a tile is walkable. Else returns false.
        canMoveDirectionFromTile: function(tileX, tileY, direction) {
            var newPos = this.getTileAdjacentToTile(tileX, tileY, direction);
            return ig.game.collisionMap.data[newPos.y][newPos.x] === 0;
        },

        canMoveDirectionFromCurrentTile: function(direction) {
            var currTile = this.getTilePos();
            return this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
        },

        // Sets the velocity of the entity so that it will move toward the tile.
        setVelocityByTile: function(x, y, velocity) {
            var tilesize = ig.game.collisionMap.tilesize;
            var tileCenterX = x * tilesize + tilesize/2;
            var tileCenterY = y * tilesize + tilesize/2;
            var entityCenterX = this.pos.x + this.size.x / 2;
            var entityCenterY = this.pos.y + this.size.y / 2;
            var distanceX = tileCenterX - entityCenterX;
            var distanceY = tileCenterY - entityCenterY;
            this.vel.x = (distanceX >= 0 ? 1 : -1) * velocity * (Math.abs(distanceX) / (Math.abs(distanceX) + Math.abs(distanceY)));
            this.vel.y = (distanceY >= 0 ? 1 : -1) * velocity * (Math.abs(distanceY) / (Math.abs(distanceX) + Math.abs(distanceY)));
        }

    });

    var moveType = {
        'UP': 1,
        'DOWN': 2,
        'LEFT': 4,
        'RIGHT': 8
    };

});