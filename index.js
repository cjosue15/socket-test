const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';

io.on('connection', (socket) => {
  // join conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Join for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.io('disconnect', () => {
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
