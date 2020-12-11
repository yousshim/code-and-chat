interface IUser {
  id: string;
  name: string;
  room: string;
}

class RoomsManager {
  private users: IUser[] = [];
}

export default RoomsManager;
