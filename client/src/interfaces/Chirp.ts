import User from './User';

interface Chirp {
  _id: string;
  content: string;
  author: User;
  replies: string[];
  metrics: {
    likeCount: number;
  };
  createdAt: string;
}

export default Chirp;
