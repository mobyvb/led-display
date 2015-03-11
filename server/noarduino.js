var appCb;
var fs = require('fs');
var PNG = require('pngjs').PNG;

module.exports = {
    on: function(event, cb) {
        if (event === 'data') {
            appCb = cb;
            nextFrame();
        }
    }
}

var rows = 7;
var cols = 7;
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

function nextFrame() {
    var data = coords;
    appCb(JSON.stringify(data));
    setTimeout(nextFrame, 30);
}

function showImage(image) {
    fs.createReadStream(image)
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function() {
            var widthPerLed = this.width / cols;
            var heightPerLed = this.height / rows;
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    // invert color
                    var r = this.data[idx];
                    var g = this.data[idx+1];
                    var b = this.data[idx+2];
                    var currLedX = Math.floor(x / widthPerLed);
                    var currLedY = Math.floor(y / heightPerLed);
                    var coordI = coordMap[currLedX][currLedY];
                    coords[coordI][0] += r;
                    coords[coordI][1] += g;
                    coords[coordI][2] += b;
                }
            }

            for (var i = 0; i < coords.length; i++) {
                var pixPerLed = widthPerLed * heightPerLed;
                coords[i][0] = Math.floor(coords[i][0] / pixPerLed);
                coords[i][1] = Math.floor(coords[i][1] / pixPerLed);
                coords[i][2] = Math.floor(coords[i][2] / pixPerLed);
            }
            nextFrame();
        });
}
showImage('fez.png');
