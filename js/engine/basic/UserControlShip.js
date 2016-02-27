/**
 * Created by treem on 2/22/16.
 */

function UserControlShip(params){
    var me = this;

    UserControlShip.superclass.constructor.call(me, params);

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

    this.aimItem = null;

    this.aimTextItem = null;

    this.config = params;

}

UserControlShip.prototype.init = function (container) {
  var me = this;

    UserControlShip.superclass.init.call(me, container);

    me.aimItem = new PIXI.Graphics();
    me.aimItem.alpha = 0.5;

    me.aimTextItem = new PIXI.Text('', {font: '15px Arial', fill: 'red'}, 2);
    me.aimTextItem.position = new PIXI.Point(0, 0);
    me.aimTextItem.anchor.x = 0.5;
    me.aimTextItem.anchor.y = 0;

    me.parentContainer.addChild(me.aimItem);
    me.parentContainer.addChild(me.aimTextItem);

    Observer.fireEvent('playerShipCreated', me);

    Observer.addListener('setPointerPos', function (newPos) {
        me.setPointerPos(newPos.x, newPos.y);
    });

    Observer.addListener('playerTryFire', function () {
        me.fireCannons();
    });

};

UserControlShip.prototype.update = function () {
  var me = this;

    me.processControls();

    UserControlShip.superclass.update.call(me);

    me.aimItem.clear();
    me.aimItem.lineStyle(10, 0x003300);
    me.aimItem.moveTo(me.x, me.y);
    me.aimItem.lineTo(me.target.x, me.target.y);
    me.aimItem.endFill();

    me.aimTextItem.position.x = me.target.x;
    me.aimTextItem.position.y = me.target.y + 30;
    //me.aimTextItem.text = 'W_ROT: ' + W_ROT.toFixed(3) + '\n'
    //    + 'S_ROT: ' + me.rotation.toFixed(3) + '\n'
    //    + 'WS_ROT: ' + (W_ROT - me.rotation).toFixed(3);
};

UserControlShip.prototype.processControls = function () {
    var me = this;

    if (me.controls.turnLeft.state && me.movingState) {
        me.turnLeft();
    }

    if (me.controls.turnRight.state && me.movingState) {
        me.turnRight();
    }

    if (me.controls.moveForward.state) {
        me.accelerate();
    } else if (me.controls.moveBackward.state) {
        me.deAccelerate();

    }


};

UserControlShip.prototype.setKey = function (keyCode, state) {
    var me = this;

    for (var key in me.controls) {
        if (me.controls[key].keyCode == keyCode) {
            me.controls[key].state = state;
        }
    }
};

extend(UserControlShip, BattleShip);