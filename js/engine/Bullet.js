function Bullet(x, y, rotation, targetX, targetY) {


    this.item = null;

    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.speed = 3;
    this.target = {
        x: targetX,
        y: targetY
    };
    this.reachTargetRadius = 5;
    this.targetReached = false;
    this.parentContainer = null;


}

Bullet.prototype.init = function (container) {
    var me = this,
        rad;

    rad = Math.atan2((me.target.y - me.y), (me.target.x - me.x));

    if(rad - me.rotation != 0){
        me.rotation = rad;
    }

    me.item = new PIXI.Graphics();

    container.addChild(me.item);

    me.parentContainer = container;

    me.item.clear();
    me.item.beginFill(0xf3a33f);
    me.item.drawCircle(0, 0, 10);
    me.item.endFill();

};

Bullet.prototype.update = function () {
    var me = this,
        dist;

    if (me.targetReached) {
        return true;
    }

    me.x = me.x + Math.cos(me.rotation) * me.speed;
    me.y = me.y + Math.sin(me.rotation) * me.speed;

    me.item.position.x = me.x;
    me.item.position.y = me.y;

    dist = Math.sqrt(Math.pow((me.target.x - me.x), 2) + Math.pow((me.target.y - me.y), 2));

    if (dist < me.reachTargetRadius) {
        me.targetReached = true;
        me.parentContainer.removeChild(me.item);
        me.onTargetReached(me);
    }
};

Bullet.prototype.onTargetReached = function () {};