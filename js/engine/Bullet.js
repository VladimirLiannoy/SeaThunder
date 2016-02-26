function Bullet(x, y, targetX, targetY, missFactor) {


    this.bulletItem = null;

    this.x = x;
    this.y = y;
    this.rotation = null;
    this.speed = 20;
    this.target = {
        x: targetX,
        y: targetY
    };
    this.reachTargetRadius = 10;
    this.targetReached = false;
    this.parentContainer = null;

}

Bullet.prototype.init = function (container) {
    var me = this;

    me.rotation = calcAngleBetween2Points(me.x, me.y, me.target.x, me.target.y);

    me.bulletItem = new PIXI.Graphics();

    container.addChild(me.bulletItem);

    me.parentContainer = container;

    me.bulletItem.clear();
    me.bulletItem.beginFill(0xf3a33f);
    me.bulletItem.drawCircle(0, 0, 10);
    me.bulletItem.endFill();

};

Bullet.prototype.update = function () {
    var me = this,
        dist;

    if (me.targetReached) {
        return true;
    }

    me.x = me.x + Math.cos(me.rotation) * me.speed;
    me.y = me.y + Math.sin(me.rotation) * me.speed;

    me.bulletItem.position.x = me.x;
    me.bulletItem.position.y = me.y;

    dist = calcDistBetween2Points(me.target.x, me.target.y, me.x, me.y);

    if (dist < me.reachTargetRadius) {
        me.targetReached = true;
        me.parentContainer.removeChild(me.bulletItem);
        me.onTargetReached(me);
    }
};

Bullet.prototype.onTargetReached = function () {};

extend(Bullet, VisualEntity);