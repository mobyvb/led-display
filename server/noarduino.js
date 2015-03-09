var appCb;

module.exports = {
    on: function(event, cb) {
        if (event === 'data') {
            appCb = cb;
            nextFrame();
        }
    }
}

function dist(x1, y1, x2, y2) {
    return Math.pow((Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)), (1/2));
}

// SETUP
var rows = 7;
var cols = 7;
var diagonal = Math.ceil(Math.pow((Math.pow(rows, 2) + Math.pow(cols, 2)), (1/2)));
var coords = [];
var coordMap = [];

for (var i = 0; i < cols; i++) {
    coordMap[i] = [];
    for (var j = 0; j < rows; j++) {
        coordMap[i][j] = 0;
    }
}

for (var i = 0; i < rows * cols; i++) {
    coords[i] = [0, 0, 0];

    var col = Math.floor(i / rows);
    var row = i % rows;

    if (col % 2 === 0) {
        row = rows - row - 1;
    }

    coordMap[col][row] = i;
}

// FRAME FUNCTIONS
function solidify(defaultColor) {
    var data = coords.slice();

    for (var i = 0; i < data.length; i++) {
        data[i] = defaultColor.slice();
    }

    return data;
}

var circleStep = 0;
function getCircleFrame(center, newColor) {
    circleStep++;
    var maxSteps = diagonal * 10; //higher value = slower animation
    if (circleStep > maxSteps || circleStep < 0) {
        circleStep = 0;
    }

    var radius = diagonal * circleStep / maxSteps;

    var data = coords.slice();

    for (var col = 0; col < coordMap.length; col++) {
        for (var row = 0; row < coordMap[col].length; row++) {
            var distDiff = Math.abs(dist(center[0], center[1], col, row) - radius);
            var sqrtTwoOverTwo = ((Math.pow(2, (1/2)))/2);
            var pixelColor = coords[coordMap[col][row]]; //old pixel color is stored in coords.

            if (distDiff <= sqrtTwoOverTwo) {
                var r = Math.ceil((pixelColor[0] * distDiff/sqrtTwoOverTwo) + (newColor[0] * (1 - distDiff/sqrtTwoOverTwo)));
                var g = Math.ceil((pixelColor[1] * distDiff/sqrtTwoOverTwo) + (newColor[1] * (1 - distDiff/sqrtTwoOverTwo)));
                var b = Math.ceil((pixelColor[2] * distDiff/sqrtTwoOverTwo) + (newColor[2] * (1 - distDiff/sqrtTwoOverTwo)));
                pixelColor = [r, g, b];
            }

            //add pixelColor to the data to be returned
            data[coordMap[col][row]] = pixelColor;
        }
    }

    return data;
}

var pacmanStep = 0;
function getPacman() {
    pacmanStep++;
    var maxSteps = 90;
    if (pacmanStep > maxSteps || pacmanStep < 0) {
        pacmanStep = 0;
    }

    var backgroundColor = [0, 0, 0];
    var yellow = [245, 245, 0];
    var data = coords.slice();

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

// CALCULATION OF FRAME
function nextFrame() {
    // solid
    coords = solidify([245, 61, 0]);

    // circle
    // coords = getCircleFrame([4, 2], [61, 245, 0]);

    // coords = getCircleFrame([2, 4], [0, 245, 61]);

    //pacman
    coords = getPacman();

    appCb(JSON.stringify(coords));
    setTimeout(nextFrame, 30);
}
