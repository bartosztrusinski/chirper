import { DefaultGenerics, MakeGenerics } from '@tanstack/react-location';

type Token = string;

type ParamsGenerics = DefaultGenerics['Params'];
type SearchGenerics = DefaultGenerics['Search'];

interface SearchParams extends SearchGenerics {
  query: string;
  sortOrder?: 'relevant' | 'recent' | 'popular';
  from?: string;
  includeReplies?: boolean;
  followedOnly?: boolean;
  startTime?: string;
  endTime?: string;
}

interface ModalParams extends SearchGenerics {
  dialog?:
    | 'menu'
    | 'advanced-search'
    | 'log-in'
    | 'sign-up'
    | 'create-chirp'
    | 'likes'
    | 'followed'
    | 'following'
    | 'edit-profile';
}

type LocationGenerics = MakeGenerics<{
  Search: SearchParams & ModalParams;
}>;

export {
  SearchParams,
  Token,
  LocationGenerics,
  ParamsGenerics,
  SearchGenerics,
};
