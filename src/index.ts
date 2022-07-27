import { createServer } from 'http';
import { Server } from 'socket.io';
import { IUser } from './models/user.model';
import { ServerStore } from './controllers/serverStore.controller';

import { NEW_CHAT_MESSAGE_EVENT, ADD_USER } from './events';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const PORT = 4000;
const serverServer = new ServerStore();

io.on('connection', (socket) => {
  console.log(socket);
  // join conversation
  const { roomId } = socket.handshake.query;
  if (roomId) {
    socket.join(roomId);
  }

  socket.on(ADD_USER, (user: IUser) => {
    serverServer.addUser(user);
    console.log(serverServer.users);
  });

  // Join for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data: any) => {
    if (roomId) {
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    }
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    console.log('object');
    if (roomId) {
      socket.leave(roomId as string);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
