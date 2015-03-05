var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
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

var serialPort = new SerialPort('/dev/cu.usbmodem1411', {
    baudrate: 115200,
    parser: serialport.parsers.readline('\n')
});

serialPort.open(function(error) {
    if (error) {
        console.log('failed to open: ' + error);
    } else {
        serialPort.on('data', function(data) {
            console.log('data received: ' + data);
            sockets.forEach(function(socket) {
                socket.emit('data', data);
            });
        });
    }
});
// var serialPort = require("serialport");
// serialPort.list(function (err, ports) {
//     ports.forEach(function(port) {
//         console.log(port.comName);
//         console.log(port.manufacturer);
//     });
// });
