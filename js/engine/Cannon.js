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

    this.facingVector = new vec2(
        Math.cos(_config.facing * PIXI.DEG_TO_RAD),
        Math.sin(_config.facing * PIXI.DEG_TO_RAD)
    );

    this.facingAngle = _config.facing * PIXI.DEG_TO_RAD;

    this.angleRange = _config.angleRange * PIXI.DEG_TO_RAD;

    this.missFactor = 5;

    this.rootShip = rootShip;

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

    me.rootContainer.addChild(me.cannonItem);
    me.rootContainer.addChild(me.aimItem);

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

    console.log(this);
};

//Cannon.prototype.recalcRotateAngleLimit = function (angle) {
//    return angle > 180 ? -(Math.PI * 2 - angle * PIXI.DEG_TO_RAD) : angle * PIXI.DEG_TO_RAD;
//};

Cannon.prototype.recalcRotateAngleLimit = function (angle) {
    return angle * PIXI.DEG_TO_RAD;
};

function calcRotateRangeLimit(direction, offset){
    return direction + offset;
}

Cannon.prototype.update = function () {
    var me = this,
        x,
        y,
        sysRotation = me.rootShip.rotation,
        newXY = new vec2(me.x, me.y).rotate(sysRotation),
        rad,
        radByShip,
        dist,
        targetVector = new vec2(me.rootShip.target.x, me.rootShip.target.y),
        rotateDiff,
        fromAngle = calcRotateRangeLimit(me.facingAngle, -me.angleRange),
        toAngle = calcRotateRangeLimit(me.facingAngle, me.angleRange),//) % (Math.PI * 2),
        normRadByShip,
        newRotaion,
        turnDir = 1;

    x = me.rootShip.x + newXY.x;
    y = me.rootShip.y + newXY.y;

    rad = calcAngleBetween2Points(x, y, targetVector.x, targetVector.y);

    radByShip = rad - sysRotation % (Math.PI * 2);


    //var currentPosition = new vec2(x, y),
    //    facingVectorRotated = me.facingVector.rotate(me.rootShip.rotation), //facing
    //    V = vecSubstr(targetVector, currentPosition),
    //    targetAngle = Math.acos(vecScalarMult(facingVectorRotated.normalize(), V.normalize()));

    normRadByShip = radByShip < 0 ? radByShip + Math.PI * 2 : radByShip;
    normRadByShip += normRadByShip < 0 ? Math.PI * 2 : 0;


    //IF WE ARE IN WORKING ZONE - FOLLOW
    if (isInRange(normRadByShip, fromAngle, toAngle)) {

        //TURN direction
        if (normRadByShip < me.rotation) {
            turnDir = -1;
        }

    } else {

        //TURN direction
        if (me.facingAngle > Math.PI) {
            if (normRadByShip > (Math.PI * 2 - me.facingAngle) && normRadByShip < me.facingAngle) {
                turnDir = -1;
            }
        } else {
            if (normRadByShip > (Math.PI * 2 - me.facingAngle) || normRadByShip < me.facingAngle) {
                turnDir = -1;
            }
        }
    }


    rotateDiff = Math.abs(me.rotation - normRadByShip);

    if (rotateDiff < me.rotateSpeed) {
        newRotaion = me.rotation + rotateDiff * turnDir;
    } else {
        newRotaion = me.rotation + me.rotateSpeed * turnDir;
    }


    if (isInRange(newRotaion, fromAngle, toAngle)) {

        me.rotation = newRotaion;
        me.rootContainer.rotation = me.rotation;

    }

    me.rotationReadyToFire = Math.abs(newRotaion - normRadByShip) < me.rotateSpeed ? true : false;

    /////////////////////

    //////CHECK
    //if (me.isInRotateRange(rad)) {


    //if (me.isInRotateRange(me.rotation)) {


    //}
    //}


    dist = calcDistBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y);
    me.aimItem.clear();
    me.aimItem.lineStyle(10, 0xf3a33f);
    me.aimItem.moveTo(0, 0);
    me.aimItem.lineTo(dist, 0);
    me.aimItem.endFill();

    if (me.debug) {

        me.cannonTextItem.text = 'ROT ' + me.rotation.toFixed(3) + '\n'
            + 'RAD ' + rad.toFixed(3) + '\n'
            + 'facing  ' + (me.facingAngle * PIXI.RAD_TO_DEG).toFixed(3) + '\n'
            + 'rotationReadyToFire  ' + me.rotationReadyToFire + '\n'
            + '< ' + (fromAngle * PIXI.RAD_TO_DEG).toFixed(1)
            + ' | ' + (normRadByShip * PIXI.RAD_TO_DEG).toFixed(1)
            + ' | ' + (toAngle * PIXI.RAD_TO_DEG).toFixed(1) + ' >';

    }

    Cannon.superclass.update.apply(me);

};

Cannon.prototype.isInRotateRange = function (angle) {
    if (angle >= this.radFrom && angle <= this.radTo) {
        return true;
    }
    return false;
};

Cannon.prototype.checkCanFire = function () {
    return this.rotationReadyToFire;
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

    if (!me.checkCanFire()) {
        return false;
    }

    rotation = me.rotation;

    newXY = calcNewCoords(me.rotation, me.x, me.y);

    x = me.rootShip.x + newXY.x;
    y = me.rootShip.y + newXY.y;

    rad = calcAngleBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y);
    radNorm = rad - me.rootShip.rotation;


    //if (!me.isInRotateRange(radNorm) || !me.canFire) {
    //    return false;
    //}

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