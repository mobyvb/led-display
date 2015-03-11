var appCb;
var getPacman = require('./getpacman.js');
var getImage = require('./getimage.js');
var solidify = require('./helpers.js').solidify;
var config = require('./config.js');
var rows = config.rows;
var cols = config.cols;
var coords = config.coords;
var coordMap = config.coordMap;

function nextFrame() {
    coords = solidify([245, 61, 0]);
    coords = getPacman(coords);

    // getImage(__dirname + '/heart.png');

    appCb(JSON.stringify(coords));
    setTimeout(nextFrame, 30);
}

module.exports = {
    on: function(event, cb) {
        if (event === 'data') {
            appCb = cb;
            nextFrame();
        }
    }
}
