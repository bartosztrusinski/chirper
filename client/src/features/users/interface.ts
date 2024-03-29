import { LocationGenerics, ParamsGenerics, Token } from '../../interface';
import { MakeGenerics } from '@tanstack/react-location';

interface User {
  _id: string;
  username: string;
  profile: {
    name: string;
    bio?: string;
    location?: string;
    website?: string;
    picture?: string;
    header?: string;
  };
  metrics: {
    chirpCount: number;
    likedChirpCount: number;
    followedCount: number;
    followingCount: number;
  };
  createdAt: string;
  isFollowed?: boolean;
}

interface UsersResponse {
  data: User[];
  meta?: {
    nextPage?: string;
  };
}

interface StoredUser extends User {
  token: Token;
}

interface UserParams extends ParamsGenerics {
  username: string;
}

type UserLocationGenerics = LocationGenerics &
  MakeGenerics<{ Params: UserParams }>;

interface UpdateUsernameParams {
  newUsername: User['username'];
  password: string;
}

interface UpdateEmailParams {
  newEmail: string;
  password: string;
}

interface UpdatePasswordParams {
  newPassword: string;
  password: string;
}

export {
  User,
  UsersResponse,
  UserLocationGenerics,
  StoredUser,
  UpdateUsernameParams,
  UpdateEmailParams,
  UpdatePasswordParams,
};
