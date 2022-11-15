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
}

export interface StoredUser {
  user: User;
  token: string;
}

export default User;
