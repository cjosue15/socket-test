import { IUser } from '../models/user.model';

export class ServerStore {
  private _users: IUser[];

  constructor() {
    this._users = [];
  }

  get users(): IUser[] {
    return this._users;
  }

  addUser(user: IUser): void {
    this._users = [...this._users, user];
  }
}
