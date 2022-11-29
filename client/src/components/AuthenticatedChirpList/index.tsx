import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import ComposeChirpModal from '../ComposeChirpModal';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import useLikedChirpIds from '../../hooks/useLikedChirpIds';
import { forwardRef, useState } from 'react';
import { StoredUser } from '../../interfaces/User';

interface AuthenticatedChirpListProps {
  chirps: IChirp[];
  queryKeys: string[];
  page: number;
}

type LastChirpRef = HTMLElement | null;

const AuthenticatedChirpList = forwardRef<
  LastChirpRef,
  AuthenticatedChirpListProps
>(function AuthenticatedChirpList({ chirps, queryKeys, page }, ref) {
  const { user } = useUser() as { user: StoredUser };
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys, page);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [chirpToReplyTo, setChirpToReplyTo] = useState<IChirp>();

  const {
    data: likedChirpIds,
    isError,
    isLoading,
    isSuccess,
  } = useLikedChirpIds(
    [...queryKeys, `${page}`],
    user.username,
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

  const handleReply = (chirp: IChirp) => {
    setChirpToReplyTo(chirp);
    setIsReplyModalOpen(true);
  };

  if (isLoading && chirps.length) {
    return <div>Loading...</div>;
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
            onReply={() => handleReply(chirp)}
          />
        );
      })}

      <ComposeChirpModal
        replyToChirp={chirpToReplyTo as IChirp}
        isOpen={isReplyModalOpen}
        onRequestClose={() => setIsReplyModalOpen(false)}
      />
    </>
  );
});

export default AuthenticatedChirpList;
