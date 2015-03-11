var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(require('express-jquery')('/jquery.js'));

var sockets = [];
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    sockets.push(socket);
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var noArduino = require('./noarduino/noarduino.js');
var serialport = require('serialport');
var mySp;
serialport.list(function (err, ports) {
    ports.forEach(function(port) {
        if (port.comName.indexOf('cu.usbmodem') > -1) {
            mySp = new serialport.SerialPort('/dev/cu.usbmodem1411', {
                baudrate: 115200,
                parser: serialport.parsers.readline('\n')
            });
        }
    });
});
if (mySp) {
    mySp.open(function(error) {
        console.log('arduino found');
        if (error) {
            console.log('failed to open: ' + error);
        } else {
            mySp.on('data', function(data) {
                sockets.forEach(function(socket) {
                    socket.emit('data', data);
                });
            });
        }
    });
} else {
    console.log('no arduino');
    noArduino.on('data', function(data) {
        sockets.forEach(function(socket) {
            socket.emit('data', data);
        });
    })
}
