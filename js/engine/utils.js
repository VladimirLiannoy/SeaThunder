/**
 * Created by treem on 2/20/16.
 */

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
    return Math.atan2((y1 - y2), (x1 - x2));
}

function calcDistBetween2Points(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

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
