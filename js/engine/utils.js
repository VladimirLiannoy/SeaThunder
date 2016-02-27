/**
 * Created by treem on 2/20/16.
 */


CONST = {
    pi_2: Math.PI * 2,
    pi_3: Math.PI * 3,
    pi: Math.PI
};

function calcNewCoords(angle, x, y) {
    var matrixA = {
            11: Math.cos(angle),
            12: -Math.sin(angle),
            21: Math.sin(angle),
            22: Math.cos(angle)
        },
        matrixB = {
            11: x,
            21: y
        };


    return {
        x: matrixA[11] * matrixB[11] + matrixA[12] * matrixB[21],
        y: matrixA[21] * matrixB[11] + matrixA[22] * matrixB[21]
    };

}

function calcAngleBetween2Points(x1, y1, x2, y2) {
    return Math.atan2((y2 - y1), (x2 - x1));
}

function calcAngleBetween2PointsNorm(x1, y1, x2, y2) {
    var rez = Math.atan2((y2 - y1), (x2 - x1));

    if (rez < 0) {
        return CONST.pi_2 + rez;
    }
    else {
        return rez;
    }


    //return Math.atan2((y1 - y2), (x1 - x2));

}

function calcDistBetween2Points(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function isInRange(value, limit1, limit2) {
    return (value >= limit1 && value <= limit2) || (value <= limit1 && value >= limit2);
}

function isInViewDegree(testAngle, facing, range) {
    var l1 = facing - range,
        l2 = facing + range;

    //Exeptional situation
    if (l1 < 0 && isInRange(testAngle - CONST.pi_2, l1, facing)) {
        l1 += CONST.pi_2;
        l2 += CONST.pi_2;
    }

    //console.log(l1.toFixed(2), testAngle.toFixed(2), l2.toFixed(2));

    return isInRange(testAngle, l1, l2);
}

function detectRotateDirection(curAngle, destAngle, rotationStep) {
    var dir = 1;

    if (destAngle > curAngle ) {
        if(CONST.pi_2 - destAngle < destAngle) {
            dir = -1;
        }
    } else {
        dir = -1;
    }

    return dir;
}


function calcShortestAngle(start, end){
    //((((end - start) % 360) + 540) % 360) - 180
    return ((((end - start) % CONST.pi_2) + CONST.pi_3) % CONST.pi_2) - CONST.pi;
}




//console.log(detectRotateDirection(350* PIXI.DEG_TO_RAD, 350 * PIXI.DEG_TO_RAD));
//console.log(detectRotateDirection(0, 90 * PIXI.DEG_TO_RAD));

function calcRotateRangeLimit(direction, facing, offset) {
    return facing + offset;// < 0 ? direction + offset + Math.PI*2 : direction + offset;
    return direction < 0 ? direction + offset + Math.PI * 2 : direction + offset;
}


console.log(isInViewDegree(250 * PIXI.DEG_TO_RAD, 0, 45 * PIXI.DEG_TO_RAD));
console.log(isInViewDegree(350 * PIXI.DEG_TO_RAD, 0, 45 * PIXI.DEG_TO_RAD));
console.log(isInViewDegree(1 * PIXI.DEG_TO_RAD, 0, 45 * PIXI.DEG_TO_RAD));
console.log(isInViewDegree(40 * PIXI.DEG_TO_RAD, 0, 45 * PIXI.DEG_TO_RAD));
console.log(isInViewDegree(50 * PIXI.DEG_TO_RAD, 0, 45 * PIXI.DEG_TO_RAD));


function extend(Child, Parent) {

    var F = function () {
        },
        ChildPrototype = Child.prototype;

    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;

    for (var prop in ChildPrototype) {
        Child.prototype[prop] = ChildPrototype[prop];
    }

}


function vec2(x, y) {
    this.x = x;
    this.y = y;
}

vec2.prototype.normalize = function () {
    var num = Math.sqrt(this.x * this.x + this.y * this.y);
    return new vec2(
        this.x / num, this.y / num
    );
};

vec2.prototype.rotate = function (angle) {
    return new vec2(
        Math.cos(angle) * this.x - Math.sin(angle) * this.y,
        Math.sin(angle) * this.x + Math.cos(angle) * this.y
    );
};

function vecSubstr(v1, v2) {
    return new vec2(v1.x - v2.x, v1.y - v2.y);
}

function vecScalarMult(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

var G = new vec2(1, 3),
    D = new vec2(1, 1),
    H = new vec2(3, 2),
    V = vecSubstr(H, G);

console.log(
    Math.acos(vecScalarMult(D.normalize(), V.normalize()))
);