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
  } = useLikedChirpIds(
    [...queryKeys, `${page}`],
    user.username,
    chirps.map((chirp) => chirp._id),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  const isChirpLiked = (chirpId: string) => likedChirpIds.includes(chirpId);

  const handleLike = (chirpId: string) => {
    if (isChirpLiked(chirpId)) {
      unlikeChirp(chirpId);
    } else {
      likeChirp(chirpId);
    }
  };

  const handleReply = (chirp: IChirp) => {
    setChirpToReplyTo(chirp);
    setIsReplyModalOpen(true);
  };

  return (
    <>
      {chirps.map((chirp, index) => {
        const isLastChirp = index === chirps.length - 1;

        return (
          <Chirp
            ref={isLastChirp ? ref : null}
            key={chirp._id}
            chirp={chirp}
            isLiked={isChirpLiked(chirp._id)}
            onLike={() => handleLike(chirp._id)}
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
