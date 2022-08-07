import { ISession } from '../models/session.model';
import { IUser } from '../models/user.model';

export class ServerStore {
  private _sessions: ISession[];

  constructor() {
    this._sessions = [];
  }

  get sessions(): ISession[] {
    return this._sessions;
  }

  addSession(session: ISession): void {
    this._sessions = [...this._sessions, session];
  }

  findBySession(sessionID: string) {
    return this._sessions.find((session) => session.sessionID === sessionID);
  }

  removeSession(sessionID: string): void {
    this._sessions = this._sessions.filter((session) => session.sessionID !== sessionID);
  }
}
