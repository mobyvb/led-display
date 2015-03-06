var appCb;

module.exports = {
    on: function(event, cb) {
        if (event === 'data') {
            appCb = cb;
            nextFrame();
        }
    }
}

function nextFrame() {
    var data = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]];
    appCb(JSON.stringify(data));
    setTimeout(nextFrame, 30);
}
