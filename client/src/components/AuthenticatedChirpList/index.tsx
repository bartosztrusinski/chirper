import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import useLikeChirp from '../../hooks/useLikeChirp';
import useLikedChirpIds from '../../hooks/useLikedChirpIds';
import { forwardRef } from 'react';
import Loader from '../Loader';

interface AuthenticatedChirpListProps {
  chirps: IChirp[];
  queryKeys: unknown[];
  page: number;
}

type LastChirpRef = HTMLElement | null;

const AuthenticatedChirpList = forwardRef<
  LastChirpRef,
  AuthenticatedChirpListProps
>(function AuthenticatedChirpList({ chirps, queryKeys, page }, ref) {
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys, page);

  const {
    data: likedChirpIds,
    isError,
    isInitialLoading,
    isSuccess,
  } = useLikedChirpIds(
    [...queryKeys, `${page}`],
    chirps.map((chirp) => chirp._id),
  );

  const isChirpLiked = (chirp: IChirp) =>
    isSuccess && likedChirpIds.includes(chirp._id);

  const handleLike = (chirp: IChirp) => {
    if (isChirpLiked(chirp)) {
      unlikeChirp(chirp);
    } else {
      likeChirp(chirp);
    }
  };

  if (isInitialLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  return (
    <>
      {chirps.map((chirp, index) => {
        const isLastChirp = index === chirps.length - 1;

        return (
          <Chirp
            ref={isLastChirp ? ref : null}
            key={chirp._id}
            chirp={chirp}
            isLiked={isChirpLiked(chirp)}
            onLike={() => handleLike(chirp)}
          />
        );
      })}
    </>
  );
});

export default AuthenticatedChirpList;
