const express = require('express');
// const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUserInRoom } = require('./users.js');

const PORT = process.env.PORT || 10000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
// const io = socketio(server);

app.use(cors());
const io = require("socket.io")(server, {
    cors: {
      origin: "https://kady2023-live-chat-app.netlify.app/",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if(error) return callback(error);

      socket.join(user.room);

      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

      io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});

      callback();
    });

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, text: message});
      
      callback();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if(user){
        io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`});
        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room)});
      }
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
