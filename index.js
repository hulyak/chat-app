const path = require('path');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`server is listening on port ${server.address().port} `);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// events : connection and message
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('message', { hulya: 'hey, how are you?' });
  socket.on('another event', (data) => {
    console.log(data);
  });
});
