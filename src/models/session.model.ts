import { IUser } from './user.model';

export interface ISession {
  sessionID: string;
  user: IUser;
}
