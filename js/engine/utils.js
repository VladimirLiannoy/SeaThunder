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