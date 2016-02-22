/**
 * Created by treem on 2/22/16.
 */

function UserControlShip(params){
    var me = this;

    UserControlShip.superclass.constructor.call(me, params);

    console.log(params);

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

}

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