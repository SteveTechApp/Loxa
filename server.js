const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

let messages = [];
let users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send_message', (msg) => {
    messages.push(msg);
    io.emit('receive_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    res.sendStatus(200);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    res.status(400).send('User already exists');
  } else {
    users[username] = password;
    res.sendStatus(200);
  }
});

app.post('/translate', (req, res) => {
  const { text, to } = req.body;
  // Dummy translation logic
  res.json({ translatedText: `[${to}] ${text}` });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});