/**
 * Created by treem on 2/22/16.
 */

function BattleShip(params) {
    var me = this;

    BattleShip.superclass.constructor.call(me, params);

    this.cannonItems = [];
    this.torpedoItems = [];
    this.turretItems = [];

    this.parentContainer = null;
    this.rootContainer = null;
    this.shipItem = null;

    this.cannonsConfig = params.cannonsConfig ? params.cannonsConfig : [];
    this.torpedoGatewaysConfig = params.torpedoGatewaysConfig ? params.torpedoGatewaysConfig : [];
    this.turretsConfig = params.turretsConfig ? params.turretsConfig : [];

    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.acceleration = params.acceleration ? params.acceleration : 0.02;
    this.maxSpeed = params.maxSpeed ? params.maxSpeed : 2;
    this.currentSpeed = 0;
    this.rotationSpeed = params.rotationSpeed ? params.rotationSpeed : 0.002;
    this.movingState = false;

    this.target = {
        x: 0,
        y: 0
    };

    this.aimItem = null;


}

BattleShip.prototype.init = function (container) {
    var me = this;

    me.parentContainer = container;

    me.rootContainer = new PIXI.Container();
    me.rootContainer.position = new PIXI.Point(me.x, me.y);

    me.shipItem = new PIXI.Sprite.fromImage('images/ship.png');
    me.shipItem.anchor.set(0.5);
    me.shipItem.scale.set(0.5);

    me.rootContainer.addChild(me.shipItem);

    me.initCannons();
    me.initTorpedo();
    me.initTurrets();

    me.aimItem = new PIXI.Graphics();
    me.aimItem.alpha = 0.5;

    me.parentContainer.addChild(me.rootContainer);

};

BattleShip.prototype.initCannons = function () {
    var me = this,
        cannon,
        i;

    for (i = 0; i < me.cannonsConfig.length; i++) {

        cannon = new Cannon(me, me.cannonsConfig[i]);
        cannon.init(me.rootContainer);

        me.cannonItems.push(cannon);
        me.addChild(cannon);
    }
};

BattleShip.prototype.initTorpedo = function () {};

BattleShip.prototype.initTurrets = function () {};



BattleShip.prototype.fireCannons = function () {
    var me = this,
        i;

    for (i = 0; i < me.cannonItems.length; i++) {
        me.cannonItems[i].fire();
    }
};

BattleShip.prototype.update = function () {
    var me = this, dist;

    me.movingState = Math.abs(me.currentSpeed) >= me.acceleration ? true : false;

    if (me.movingState) {
        me.x = me.x + Math.cos(me.rotation) * me.currentSpeed;
        me.y = me.y + Math.sin(me.rotation) * me.currentSpeed;
    }

    BattleShip.superclass.update.apply(me);

    me.rootContainer.position.x = me.x;
    me.rootContainer.position.y = me.y;
    me.rootContainer.rotation = me.rotation;

    dist = 20;// calcDistBetween2Points(me.rootShip.target.x, me.rootShip.target.y, x, y);
    me.aimItem.clear();
    me.aimItem.lineStyle(10, 0xf3a33f);
    me.aimItem.moveTo(0, 0);
    me.aimItem.lineTo(dist, 0);
    me.aimItem.endFill();
};

BattleShip.prototype.accelerate = function () {
    this.currentSpeed += this.acceleration;
    this.currentSpeed = this.currentSpeed > this.maxSpeed ? this.maxSpeed : this.currentSpeed;
};

BattleShip.prototype.deAccelerate = function () {
    this.currentSpeed -= this.acceleration;
    this.currentSpeed = (this.currentSpeed < -this.maxSpeed / 2) ? (-this.maxSpeed / 2) : this.currentSpeed;
};

BattleShip.prototype.turnLeft = function () {
    this.rotation -= this.rotationSpeed;
};

BattleShip.prototype.turnRight = function () {
    this.rotation += this.rotationSpeed;
};


BattleShip.prototype.setPointerPos = function (x, y) {
    this.target.x = x;
    this.target.y = y;
};

extend(BattleShip, VisualEntity);