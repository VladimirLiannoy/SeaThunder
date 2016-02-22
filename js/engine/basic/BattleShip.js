/**
 * Created by treem on 2/22/16.
 */

function BattleShip(params) {
    var me = this;


    this.rootContainer = null;

    this.shipItem = null;
    this.turretItems = [];

    BattleShip.superclass.constructor.call(me, params);

    this.parentContainer = params;

    this.turrets = [
        {
            x: 0,
            y: 0,
            radCompensation: 90 * Math.PI / 180
        },
        {
            x: -60,
            y: 0,
            radCompensation: 90 * Math.PI / 180
        },
        {
            x: 60,
            y: 0,
            radCompensation: 90 * Math.PI / 180
        }
    ];

    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.acceleration = 0.02;
    this.maxSpeed = 2;
    this.currentSpeed = 0;
    this.rotationSpeed = 0.002;
    this.movingState = false;

    this.target = {
        x: 0,
        y: 0
    };


}

BattleShip.prototype.init = function () {
    var me = this,
        turret,
        i;


    me.rootContainer = new PIXI.Container();
    me.rootContainer.position = new PIXI.Point(me.x, me.y);

    me.shipItem = new PIXI.Sprite.fromImage('images/ship.png');
    me.shipItem.anchor.set(0.5);
    me.shipItem.scale.set(0.5);

    me.rootContainer.addChild(me.shipItem);

    for (i = 0; i < me.turrets.length; i++) {

        turret = new Turret(me, me.turrets[i]);
        turret.init(me.rootContainer);

        me.turretItems.push(turret);
    }

    me.parentContainer.addChild(me.rootContainer);

};


BattleShip.prototype.fireCannons = function () {
    var me = this,
        turret,
        i;

    for (i = 0; i < me.turretItems.length; i++) {
        turret = me.turretItems[i];
        turret.fire();
    }
};

BattleShip.prototype.update = function () {
    var me = this;

    me.processControls();//////!!!!!!!!!!!

    me.movingState = Math.abs(me.currentSpeed) >= me.acceleration ? true : false;

    if (me.movingState) {
        me.x = me.x + Math.cos(me.rotation) * me.currentSpeed;
        me.y = me.y + Math.sin(me.rotation) * me.currentSpeed;
    }

    BattleShip.superclass.update.apply(me);

    me.rootContainer.position.x = me.x;
    me.rootContainer.position.y = me.y;
    me.rootContainer.rotation = me.rotation;
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