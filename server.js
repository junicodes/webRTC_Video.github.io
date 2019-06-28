var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// server.listen(3000);
server.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});
// //setting middleware
app.use(express.static(__dirname + '/js')); //Serves resources from public folder
// //setting middleware
app.use(express.static(__dirname + '/css')); //Serves resources from public folder
app.use(express.static(__dirname + '/'));

io.on('connection', function(socket) {
   //get the message from the client
   socket.on('you.message', function(message) {
      //Send gotten client data to other client
      io.emit('you.message', message);
   });


   socket.on('disconnect', function () {
       io.emit('chat.message', 'User disconnected');
   });
});
