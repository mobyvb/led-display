var dist = require('./helpers.js').dist;
var config = require('./config.js');
var rows = config.rows;
var cols = config.cols;
var coords = config.coords;
var coordMap = config.coordMap;

var pacmanStep = 0;
function getPacman(data) {
    pacmanStep++;
    var maxSteps = 90;
    if (pacmanStep > maxSteps || pacmanStep < 0) {
        pacmanStep = 0;
    }

    var backgroundColor = [0, 0, 0];
    var yellow = [245, 245, 0];
    data = data.slice();

    if (pacmanStep <= 10) {
        //fade middle pixel pellet
        var pixelColor = data[coordMap[3][3]]; //old pixel color is stored in coords.
        var r = Math.ceil((255 * (pacmanStep / 10)) + (pixelColor[0] * (1 - (pacmanStep / 10))));
        var g = Math.ceil((255 * (pacmanStep / 10)) + (pixelColor[1] * (1 - (pacmanStep / 10))));
        var b = Math.ceil((255 * (pacmanStep / 10)) + (pixelColor[2] * (1 - (pacmanStep / 10))));
        data[coordMap[3][3]] = [r, g, b];
    } else {
        //draw pellet
        if (pacmanStep <= 32) {
            data[coordMap[3][3]] = [255, 255, 255];
        }

        //draw pacman coming
        //pacmanStep is within 10 and 90
        var centerPos = (pacmanStep/6) - (14/3);
        var center = [centerPos, 3];
        var sqrtTwoOverTwo = ((Math.pow(2, (1/2)))/2);
        var radius = 2.3;
        var angle = - (Math.sin(2 * pacmanStep / 5) - 1) / 1.4;

        for (var col = 0; col < coordMap.length; col++) {
            for (var row = 0; row < coordMap[col].length; row++) {
                var distDiff = dist(center[0], center[1], col, row);
                var currAngle = Math.abs(Math.atan2(row - center[1], col - center[0]));

                //first check if is mouth
                if (col < center[0] || currAngle > angle) {
                    //either on left size of pacman, or not in the angle.
                    if (distDiff < radius) {
                        //pixel inside the circle, should be yellow
                        data[coordMap[col][row]] = yellow;
                    } else if (distDiff - radius <= sqrtTwoOverTwo) {
                        //pixel at edge of circle, and not in angle. Should fade according to radius
                        var percent = (distDiff - radius) / sqrtTwoOverTwo;
                        var pixelColor = data[coordMap[col][row]]; //old pixel color is stored in coords.
                        var r = Math.ceil((yellow[0] * (1 - percent)) + (pixelColor[0] * (percent)));
                        var g = Math.ceil((yellow[1] * (1 - percent)) + (pixelColor[1] * (percent)));
                        var b = Math.ceil((yellow[2] * (1 - percent)) + (pixelColor[2] * (percent)));
                        data[coordMap[col][row]] = [r, g, b];
                    }
                } else {
                    //on right side and inside angle. should either fade or not be modified
                    var fadeGapAngle = (angle / 1.9) + 0.1; //lower values in division == fades more
                    if (angle - currAngle < fadeGapAngle) {
                        //its at edge of angle.
                        var percent = (angle - currAngle) / (fadeGapAngle);

                        if (!(distDiff < radius)) {
                            if (distDiff - radius <= sqrtTwoOverTwo) {
                                //it's also at edge of radius.
                                percent = percent * (distDiff - radius) / sqrtTwoOverTwo;
                            } else {
                                percent = 1;
                            }
                        }

                        var pixelColor = data[coordMap[col][row]]; //old pixel color is stored in coords.
                        var r = Math.ceil((yellow[0] * (1 - percent)) + (pixelColor[0] * (percent)));
                        var g = Math.ceil((yellow[1] * (1 - percent)) + (pixelColor[1] * (percent)));
                        var b = Math.ceil((yellow[2] * (1 - percent)) + (pixelColor[2] * (percent)));
                        data[coordMap[col][row]] = [r, g, b];
                    }
                }
            }
        }
    }

    return data;
}

module.exports = getPacman;
