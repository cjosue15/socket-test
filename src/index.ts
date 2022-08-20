import { createServer } from 'http';
import { Server } from 'socket.io';
import { IUser } from './models/user.model';
import { ISocket } from './models/socket.model';
import { ServerStore } from './controllers/serverStore.controller';
import { randomBytes } from 'crypto';
const randomId = () => randomBytes(8).toString('hex');

import { NEW_CHAT_MESSAGE_EVENT, ADD_USER } from './events';
import { ISession } from './models/session.model';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const PORT = 4000;
const serverStore = new ServerStore();

io.use((socket, next) => {
  const { auth } = socket.handshake;
  const sessionID = auth?.sessionID;

  if (sessionID) {
    const session = serverStore.findBySession(sessionID);

    if (session) {
      (socket as ISocket).session = session;
      return next();
    }
  }

  if (Object.keys(auth).length === 0) {
    return next(new Error('No auth!'));
  }

  // create new session
  const newSession: ISession = {
    sessionID: randomId(),
    user: {
      id: socket.id,
      name: auth.user.name,
      phone: auth.user.phone,
    },
  };

  (socket as ISocket).session = newSession;
  serverStore.addSession(newSession);
  next();
});

io.on('connection', (socket) => {
  socket.emit('SESSION', {
    session: (socket as ISocket).session,
  });

  io.emit('GET_SESSIONS', serverStore.sessions);
  // private messsage
  socket.on('PRIVATE_MESSAGE', ({ message, to }) => {
    console.log({ message, to });
    socket.to(to).emit('PRIVATE_MESSAGE', {
      message,
      from: socket.id,
    });
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    // console.log((socket as ISocket).session);
    // serverStore.removeSession((socket as ISocket).session.sessionID);
    // io.emit('READ_USER', serverStore.sessions);
    // console.log(serverStore.sessions);
    // if (roomId) {
    //   socket.leave(roomId as string);
    // }
  });
});

httpServer.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
