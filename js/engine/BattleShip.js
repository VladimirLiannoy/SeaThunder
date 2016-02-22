function BattleShip(container) {
    var me = this;


    var rootContainer,
        shipItem,
        turretItems = [];

    this.parentContainer = container;

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

    this.x = 300;
    this.y = 300;
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

    this.controls = {
        turnLeft: {
            keyCode: 65,
            state: false
        },
        turnRight: {
            keyCode: 68,
            state: false
        },
        moveForward: {
            keyCode: 87,
            state: false
        },
        moveBackward: {
            keyCode: 83,
            state: false
        }
    };

    this.init = function () {
        var turret, i;


        rootContainer = new PIXI.Container();
        rootContainer.position = new PIXI.Point(me.x, me.y);

        shipItem = new PIXI.Sprite.fromImage('images/ship.png');
        shipItem.anchor.set(0.5);
        shipItem.scale.set(0.5);

        rootContainer.addChild(shipItem);

        for (var i = 0; i < me.turrets.length; i++) {

            turret = new Turret(me, me.turrets[i]);
            turret.init(rootContainer);

            turretItems.push(turret);
        }

        container.addChild(rootContainer);

    };

    this.setPointerPos = function (x, y) {
        me.target.x = x;
        me.target.y = y;
    };

    this.update = function () {
        var dist,
            x, y, rad, i, turret;

        me.processControls();

        if (me.movingState) {
            me.x = me.x + Math.cos(me.rotation) * me.currentSpeed;
            me.y = me.y + Math.sin(me.rotation) * me.currentSpeed;
        }

        for (i = 0; i < turretItems.length; i++) {
            turret = turretItems[i];
            turret.update();
        }

        rootContainer.position.x = me.x;
        rootContainer.position.y = me.y;
        rootContainer.rotation = me.rotation;
    };

    this.processControls = function () {

        if (me.controls.turnLeft.state && me.movingState) {
            me.rotation -= me.rotationSpeed;
        }

        if (me.controls.turnRight.state && me.movingState) {
            me.rotation += me.rotationSpeed;
        }

        if (me.controls.moveForward.state) {
            me.currentSpeed += me.acceleration;
            me.currentSpeed = me.currentSpeed > me.maxSpeed ? me.maxSpeed : me.currentSpeed;
        } else if (me.controls.moveBackward.state) {
            me.currentSpeed -= me.acceleration;
            me.currentSpeed = me.currentSpeed < -me.maxSpeed/2 ? -me.maxSpeed/2 : me.currentSpeed;
        }
        //else {
        //    me.currentSpeed -= me.acceleration;
        //    me.currentSpeed = me.currentSpeed < 0 ? 0 : me.currentSpeed;
        //}

        me.movingState = Math.abs(me.currentSpeed) >= me.acceleration ? true : false;

    };

    this.setKey = function (keyCode, state) {
        for (var key in me.controls) {
            if (me.controls[key].keyCode == keyCode) {
                me.controls[key].state = state;
                console.log(keyCode, state, me.controls[key].state);
            }
        }
    };

    this.fireCannons = function () {
        var turret, i;

        for (i = 0; i < turretItems.length; i++) {
            turret = turretItems[i];
            turret.fire();
        }
    };

}
