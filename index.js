const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`server is listening on port ${server.address().port} `);
});

app.use(express.static('public'));

app.get('/javascript', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/javascript.html'));
});

app.get('/python', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/python.html'));
});

app.get('/node', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/node.html'));
});

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

// Index.html is the client, connects to server with localhost, server(index.js) is expecting a connection, emit a message, client will receive that 'message', it will take the data, then it will emit a message 'another event'.
