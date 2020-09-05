const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`server is listening on port ${server.address().port} `);
});

app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// Namespaces for rooms
// tech namespace
const tech = io.of('/tech');

// events : connection and message
tech.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (msg) => {
    console.log(`message ${msg}`);
    tech.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');

    tech.emit('message', 'user disconnected');
  });
});
