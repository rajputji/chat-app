var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

let messageStore = [];

app.get('/messages', (req, res) => {
  res.send(messageStore);
});

app.post('/messages', async (req, res) => {
  try {
    messageStore.push(req.body);
    io.emit('message', req.body);

    if (messageStore.length > 500) {
      messageStore = messageStore.slice(0, 250);
    }

    res.sendStatus(200);
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }
  finally {
    console.log('Message Posted')
  }
});

io.on('connection', () => {
  console.log('new user connected')
})

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
