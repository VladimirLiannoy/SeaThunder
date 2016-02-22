function Bullet(x, y, rotation, targetX, targetY) {
    var me = this;

    var item;

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


    this.init = function (container) {
        var rad;

        rad = Math.atan2((me.target.y - y), (me.target.x - x));

        if(rad - me.rotation != 0){
            me.rotation = rad;
        }


        item = new PIXI.Graphics();

        container.addChild(item);

        me.parentContainer = container;

        item.clear();
        item.beginFill(0xf3a33f);
        item.drawCircle(0, 0, 10);
        item.endFill();

        //console.log(rad, me.rotation, Math.abs(rad - me.rotation));

    };

    this.update = function () {
        var dist;

        if (me.targetReached) {
            return true;
        }

        me.x = me.x + Math.cos(me.rotation) * me.speed;
        me.y = me.y + Math.sin(me.rotation) * me.speed;

        item.position.x = me.x;
        item.position.y = me.y;

        dist = Math.sqrt(Math.pow((me.target.x - me.x), 2) + Math.pow((me.target.y - me.y), 2));

        if (dist < me.reachTargetRadius) {
            me.targetReached = true;
            console.log('onTargetReached');
            me.parentContainer.removeChild(item);
            me.onTargetReached(me);
        }
    };

    this.onTargetReached = function () {};

}