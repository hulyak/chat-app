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
  // join rooms
  socket.on('join', (data) => {
    socket.join(data.room);
    tech.in(data.room).emit('message', `New user joined ${data.room} room`);
  });

  socket.on('message', (data) => {
    console.log(`message ${data.msg}`);
    tech.in(data.room).emit('message', data.msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');

    tech.emit('message', 'user disconnected');
  });
});
