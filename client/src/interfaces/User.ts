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

type Token = string;

interface StoredUser extends User {
  token: Token;
}

export { User, Token, StoredUser };
