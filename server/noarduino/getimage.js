var fs = require('fs');
var PNG = require('pngjs').PNG;
var config = require('./config.js');
var rows = config.rows;
var cols = config.cols;
var coords = config.coords;
var coordMap = config.coordMap;

function getImage(image) {
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
        });
}

module.exports = getImage;
