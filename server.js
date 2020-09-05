const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// update messages instantly with web sockets
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/public/jquery.html')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// default es6 promise
mongoose.Promise = Promise;

// const dbUrl =

const Message = mongoose.model('Message', {
  name: String,
  message: String,
});

// const messages = [
//   { name: 'Tim', message: 'Hi' },
//   { name: 'Bob', message: 'Hello' },
// ];

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    if (err) return err;
    res.send(messages);
  });
});

app.get('/messages/:user', (req, res) => {
  const user = req.params.user;
  Message.find({ name: user }, (err, messages) => {
    if (err) return err;
    res.send(messages);
  });
});

app.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    // save to mongo db
    const savedMessage = await message.save();
    // messages.push(req.body); // add the message
    console.log('saved');

    const censored = await Message.findOne({ message: 'badword' });

    if (censored) await Message.remove({ _id: censored.id });
    else io.emit('message', req.body);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    return console.error(err);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

// mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
//   console.log('mongo db connection', err);
// });

// node http server runs
const server = http.listen(3000, () => {
  console.log('server is listening on port', server.address().port);
});

// start jasmine => ./node_modules/.bin/jasmine init
