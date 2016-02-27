/**
 * Created by treem on 2/23/16.
 */


CONFIG = {};

CONFIG.battleshipConfig = {

    acceleration : 0.05,
    maxSpeed : 3,
    rotationSpeed : 0.01,
    health : 20000,

    cannonsConfig: [
        {
            x: 100,
            y: 0,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 0,
            angleRange: 30,
            missFactor : 5,
            rechargeTime : 3000,
            fireRange : 3000
            //debug : true
        },
        //*
        {
            x: -100,
            y: 0,
            extraAngle: 90,
            rotateSpeed : 0.005,
            facing: 180,
            angleRange: 90,
            missFactor : 5,
            rechargeTime : 3000,
            fireRange : 3000
        },

        {
            x: 40,
            y: 22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 90,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 2000,
            fireRange : 3000
        },
        {
            x: -40,
            y: 22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 90,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 2000,
            fireRange : 3000
        },

        {
            x: 40,
            y: -22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 270,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 2000,
            fireRange : 3000
        },
        {
            x: -40,
            y: -22,
            extraAngle: 90,
            rotateSpeed : 0.01,
            facing: 270,
            angleRange: 45,
            missFactor : 5,
            rechargeTime : 2000,
            fireRange : 3000
        },
        //*/

    ],


};