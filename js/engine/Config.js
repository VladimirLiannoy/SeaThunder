/**
 * Created by treem on 2/23/16.
 */


CONFIG = {};

CONFIG.battleshipConfig = {

    cannonsConfig: [
        {
            x: 40,
            y: 22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 90,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 1000
        },
        {
            x: -40,
            y: 22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 90,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 1000
        },

        {
            x: 40,
            y: -22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 270,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 1000
        },
        {
            x: -40,
            y: -22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 270,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 1000
        },

    ],


};