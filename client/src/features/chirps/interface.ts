import { LocationGenerics, ParamsGenerics } from '../../interface';
import { User } from '../users/interface';
import { MakeGenerics } from '@tanstack/react-location';

interface Chirp {
  _id: string;
  content: string;
  author: User;
  replies: string[];
  metrics: { likeCount: number };
  createdAt: string;
  isLiked?: boolean;
}

interface ChirpsResponse {
  data: Chirp[];
  meta?: {
    nextPage?: string;
  };
}

interface ChirpParams extends ParamsGenerics {
  id: string;
}

type ChirpLocationGenerics = LocationGenerics &
  MakeGenerics<{ Params: ChirpParams }>;

export { Chirp, ChirpsResponse, ChirpLocationGenerics };
