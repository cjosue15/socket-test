import { Socket } from 'socket.io';
import { ISession } from './session.model';

export interface ISocket extends Socket {
  session: ISession;
}
