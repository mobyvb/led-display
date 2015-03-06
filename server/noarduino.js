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

    if (col % 2 == 0) {
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

// function getPacman() {
//     pacmanStep++;
//     var maxSteps = 255;
//     if (pacmanStep > maxSteps || pacmanStep < 0) {
//         pacmanStep = 0;
//     }
//
//     var backgroundColor = [0, 0, 0];
//
//     if (pacmanStep < 32) {
//
//     }
// }

// CALCULATION OF FRAME
function nextFrame() {
    // solid
    coords = solidify([0, 61, 245]);

    // circle
    coords = getCircleFrame([4, 2], [245, 61, 0]);

    coords = getCircleFrame([2, 4], [0, 245, 61]);

    //pacman
    // data = getPacman();

    appCb(JSON.stringify(coords));
    setTimeout(nextFrame, 30);
}
