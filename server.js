var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);

  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: 576,
    playerId: socket.id,
    message: ""
  };

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {

    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    io.emit('disconnect', socket.id);

  });

  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
  
  socket.on('playerMovement', function (movementData) {

    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    socket.broadcast.emit('playerMoved', players[socket.id]);

  });



});



server.listen(1337, function () {
  console.log(`Listening on ${server.address().port}`);
});
