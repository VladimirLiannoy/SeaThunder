function Cannon(rootShip, _config) {
    var me = this;

    Cannon.superclass.constructor.call(me);

    this.aimItem = null;

    this.cannonItem = null;
    this.cannonTextItem = null;

    this.x = _config.x;
    this.y = _config.y;
    //this.config = _config;
    this.rotation = 0;
    this.rotateSpeed = _config.rotateSpeed;
    this.radCompensation = _config.extraAngle * PIXI.DEG_TO_RAD;
    this.radFrom = _config.angleFrom;
    this.radTo = _config.angleTo;
    this.canFire = false;

    this.missFactor = 5;

    this.rootShip = rootShip;

}

Cannon.prototype.init = function (container) {
    var me = this;

    me.radFrom = me.recalcRotateAngleLimit(me.radFrom);
    me.radTo = me.recalcRotateAngleLimit(me.radTo);

    me.rotation = me.radTo;////FIXXXX

    me.rootContainer = new PIXI.Container();
    me.rootContainer.position = new PIXI.Point(me.x, me.y);

    me.cannonItem = new PIXI.Sprite.fromImage('images/turret.png');
    me.cannonItem.anchor.set(0.5);
    me.cannonItem.scale.set(0.5);
    me.cannonItem.rotation = me.radCompensation;

    me.aimItem = new PIXI.Graphics();
    me.aimItem.alpha = 0.5;

    me.rootContainer.addChild(me.cannonItem);
    me.rootContainer.addChild(me.aimItem);

    me.cannonTextItem = new PIXI.Text('TEST', {font: '15px Arial', fill: 'red'}, 2);
    me.cannonTextItem.position = new PIXI.Point(me.x, me.y + 30);
    me.cannonTextItem.anchor.set(0.5);

    //me.rootContainer.addChild(me.cannonTextItem);

    container.addChild(me.rootContainer);
    container.addChild(me.cannonTextItem);

    me.setupEvents();
};

Cannon.prototype.recalcRotateAngleLimit = function (angle) {
    return angle > 180 ? -(Math.PI * 2 - angle * PIXI.DEG_TO_RAD) : angle * PIXI.DEG_TO_RAD;
};

Cannon.prototype.update = function () {
    var me = this, x, y, rad, radNorm, dist, newXY, rotateDiff;

    newXY = calcNewCoords(me.rootShip.rotation, me.x, me.y);

    x = me.rootShip.x + newXY.x;
    y = me.rootShip.y + newXY.y;

    rad = calcAngleBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y);

    radNorm = rad - (me.rootShip.rotation) % Math.PI;

    rotateDiff = Math.abs(me.rotation - radNorm);

    //////CHECK
    if (me.isInRotateRange(me.rotation)) {

        if (rotateDiff < me.rotateSpeed) {
            me.rotation += me.rotation > radNorm ? -rotateDiff : rotateDiff;
            me.canFire = true;
        } else {
            me.rotation += me.rotation > radNorm ? -me.rotateSpeed : me.rotateSpeed;
            me.canFire = false;
        }

        me.rootContainer.rotation = me.rotation;
    }


    dist = calcDistBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y);
    me.aimItem.clear();
    me.aimItem.lineStyle(10, 0xf3a33f);
    me.aimItem.moveTo(0, 0);
    me.aimItem.lineTo(dist, 0);
    me.aimItem.endFill();

    me.cannonTextItem.text = 'rot: ' + me.rotation.toFixed(3);

    Cannon.superclass.update.apply(me);

};

Cannon.prototype.isInRotateRange = function (angle) {
    if (angle >= this.radFrom && angle <= this.radTo) {
        return true;
    }
    return false;
};

Cannon.prototype.fire = function () {
    var me = this,
        newBullet,
        x,
        y,
        rad,
        radNorm,
        newXY,
        rotation,
        targetX = me.rootShip.target.x,
        targetY = me.rootShip.target.y;

    rotation = me.rotation;

    newXY = calcNewCoords(me.rotation, me.x, me.y);

    x = me.rootShip.x + newXY.x;
    y = me.rootShip.y + newXY.y;

    rad = calcAngleBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y);
    radNorm = rad - me.rootShip.rotation;


    if (!me.isInRotateRange(radNorm) || !me.canFire) {
        return false;
    }

    targetX += Math.random() * me.missFactor;
    targetY += Math.random() * me.missFactor;

    newBullet = new Bullet(x, y, rotation, targetX, targetY);
    newBullet.init(me.rootShip.parentContainer);
    newBullet.onTargetReached = function (bullet) {
        me.removeChild(bullet);
    }.bind(me);

    me.addChild(newBullet);

    var marker = new PIXI.Graphics();
    marker.clear();
    marker.beginFill('red');
    marker.drawCircle(0, 0, 10);
    marker.endFill();
    marker.position.x = targetX;
    marker.position.y = targetY;

    me.rootShip.parentContainer.addChild(marker);

    Observer.fireEvent('turretFired', me);
};

Cannon.prototype.setupEvents = function () {


};

extend(Cannon, VisualEntity);