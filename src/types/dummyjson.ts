export type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
  phone?: string;
  age?: number;
  gender?: string;
};

export type UsersListResponse<TUser extends DummyUser = DummyUser> = {
  users: TUser[];
  total: number;
  skip: number;
  limit: number;
};

