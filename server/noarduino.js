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

function getCircleFrame() {
    step++;
    var maxSteps = diagonal * 1.8; //ensures that circle will grow at 1/3 pixel per step.
    if (step > maxSteps || step < 0) {
        step = 0;
    }

    console.log("MAXSTEPS : " + maxSteps);
    var radius = diagonal * step / maxSteps;
    var center = [3, 3];

    var defaultColor = [0, 61, 245];
    var newColor = [245, 61, 0];

    var data = coords.slice();

    for (var col = 0; col < coordMap.length; col++) {
        for (var row = 0; row < coordMap[col].length; row++) {
            var distDiff = Math.abs(dist(center[0], center[1], col, row) - radius);
            var sqrtTwoOverTwo = ((Math.pow(2, (1/2)))/2);
            var pixelColor = defaultColor;

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

// DEFINES WHICH FRAME TO GENERATE
var step = 0;

// CALCULATION OF FRAME
function nextFrame() {
    // fallback
    var data = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]];

    // circle
    data = getCircleFrame();

    appCb(JSON.stringify(data));
    setTimeout(nextFrame, 30);
}
