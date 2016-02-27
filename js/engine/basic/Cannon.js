function Cannon(rootShip, _config) {
    var me = this;

    Cannon.superclass.constructor.call(me);

    this.aimItem = null;

    this.cannonItem = null;
    this.cannonTextItem = null;

    this.debug = _config.debug;

    this.x = _config.x;
    this.y = _config.y;
    //this.config = _config;
    this.rotation = 0;
    this.rotateSpeed = _config.rotateSpeed;
    this.radCompensation = _config.extraAngle * PIXI.DEG_TO_RAD;

    //this.facingVector = new vec2(
    //    Math.cos(_config.facing * PIXI.DEG_TO_RAD),
    //    Math.sin(_config.facing * PIXI.DEG_TO_RAD)
    //);

    this.facingAngle = _config.facing * PIXI.DEG_TO_RAD;

    this.angleRange = _config.angleRange * PIXI.DEG_TO_RAD;

    this.fireRange = _config.fireRange;

    this.missFactor = _config.missFactor;

    this.rootShip = rootShip;

    /////////////////////////////////
    this.inFireRange = false;
    this.rotationReadyToFire = false;
    this.rechargingBullet = false;
    this.rechargeTime = _config.rechargeTime;

    this.lineColors = {
        recharging: 0x993333,
        ready: 0x009900
    };

}

Cannon.prototype.init = function (container) {
    var me = this;

    me.radFrom = me.recalcRotateAngleLimit(me.radFrom);
    me.radTo = me.recalcRotateAngleLimit(me.radTo);

    me.rotation = me.facingAngle;////FIXXXX

    me.rootContainer = new PIXI.Container();
    me.rootContainer.position = new PIXI.Point(me.x, me.y);

    me.cannonItem = new PIXI.Sprite.fromImage('images/turret.png');
    me.cannonItem.anchor.set(0.5);
    me.cannonItem.scale.set(0.5);
    me.cannonItem.rotation = me.radCompensation;

    me.aimItem = new PIXI.Graphics();
    me.aimItem.alpha = 0.5;

    me.rootContainer.addChild(me.aimItem);
    me.rootContainer.addChild(me.cannonItem);

    me.cannonTextItem = new PIXI.Text('', {
        font: '15px Arial',
        fill: 'red',
        stroke: 'black',
        strokeThickness: 3
    }, 4);
    me.cannonTextItem.position = new PIXI.Point(me.x, me.y + 30);
    me.cannonTextItem.anchor.set(0.5);

    //me.rootContainer.addChild(me.cannonTextItem);

    container.addChild(me.rootContainer);
    container.addChild(me.cannonTextItem);

    me.setupEvents();
};

Cannon.prototype.recalcRotateAngleLimit = function (angle) {
    return angle * PIXI.DEG_TO_RAD;
};

Cannon.prototype.update = function () {
    var me = this,

        sysRotation = me.rootShip.rotation,
        rotatedXY = new vec2(me.x, me.y).rotate(sysRotation),

        x = me.rootShip.x + rotatedXY.x,
        y = me.rootShip.y + rotatedXY.y,

        targetVector = new vec2(me.rootShip.target.x, me.rootShip.target.y),

        rad = calcAngleBetween2Points(x, y, targetVector.x, targetVector.y),
        radByShip = rad - sysRotation % CONST.pi_2,

        targetDist = calcDistBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y),

        rotateDiff,

        normRadByShip,
        newRotaion,
        turnDir = 1,
        isInView = false;

    normRadByShip = radByShip < 0 ? radByShip + CONST.pi_2 : radByShip;
    normRadByShip += normRadByShip < 0 ? CONST.pi_2 : 0;

    rotateDiff = calcShortestAngle(me.rotation, normRadByShip);

    if (Math.abs(rotateDiff) < me.rotateSpeed) {

        newRotaion = me.rotation + rotateDiff;
        me.rotationReadyToFire = true;

    } else {

        newRotaion = me.rotation + (rotateDiff < 0 ? -me.rotateSpeed : me.rotateSpeed);
        me.rotationReadyToFire = false;
    }


    if (isInViewDegree(newRotaion, me.facingAngle, me.angleRange)) {

        me.rotation = newRotaion;
        me.rootContainer.rotation = me.rotation;
    }

    ///////
    if(targetDist > me.fireRange){
        targetDist = me.fireRange;
        me.inFireRange = false;
    } else {
        me.inFireRange = true;
    }
    ///////

    me.aimItem.clear();
    me.aimItem.lineStyle(5, (me.rechargingBullet || !me.rotationReadyToFire) ? me.lineColors['recharging'] : me.lineColors['ready']);
    me.aimItem.moveTo(0, 0);
    me.aimItem.lineTo(targetDist, 0);
    me.aimItem.endFill();

    if (me.debug) {

        me.cannonTextItem.text = 'ROT ' + me.rotation.toFixed(3) + '\n'
            + 'RAD ' + rad.toFixed(3) + '\n'
            + 'facing  ' + (me.facingAngle * PIXI.RAD_TO_DEG).toFixed(3) + '\n'
            + 'rotationReadyToFire  ' + me.rotationReadyToFire + '\n'
            + 'rotateDiff  ' + rotateDiff.toFixed(3) + '\n'
            + 'normRadByShip  ' + normRadByShip.toFixed(3) + '\n'
            + 'turnDir  ' + turnDir + '\n'
//            + '< ' + (limit1 * PIXI.RAD_TO_DEG).toFixed(1)
            + ' isInView ' + isInView
//            + ' | ' + (limit2 * PIXI.RAD_TO_DEG).toFixed(1) + ' >'
        ;

    }

    Cannon.superclass.update.apply(me);

};

Cannon.prototype.checkCanFire = function () {
    return this.rotationReadyToFire && !this.rechargingBullet && this.inFireRange;
};

Cannon.prototype.fire = function () {
    var me = this,
        newBullet,

        sysRotation = me.rootShip.rotation,
        rotatedXY = new vec2(me.x, me.y).rotate(sysRotation),
        targetVector = new vec2(me.rootShip.target.x, me.rootShip.target.y),

        x = me.rootShip.x + rotatedXY.x,
        y = me.rootShip.y + rotatedXY.y;

    if (!me.checkCanFire()) {
        return false;
    }


    newBullet = new Bullet(x, y, targetVector.x, targetVector.y, me.missFactor);
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
    marker.position.x = newBullet.target.x;
    marker.position.y = newBullet.target.y;

    me.rootShip.parentContainer.addChild(marker);

    me.startRechargeBullet();

    Observer.fireEvent('cannonFired', me);
};

Cannon.prototype.startRechargeBullet = function () {
    var me = this;

    me.rechargingBullet = true;

    setTimeout(function () {
        me.rechargingBullet = false;
        Observer.fireEvent('cannonRechargeFinished', me);
    }, me.rechargeTime);
};

Cannon.prototype.setupEvents = function () {


};

extend(Cannon, VisualEntity);