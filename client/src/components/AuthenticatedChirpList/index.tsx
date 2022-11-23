import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import useLikedChirpIds from '../../hooks/useLikedChirpIds';
import { StoredUser } from '../../interfaces/User';
import ComposeChirpModal from '../ComposeChirpModal';
import { useState } from 'react';

interface ChirpListProps {
  chirps: IChirp[];
  queryKeys: string[];
}

const AuthenticatedChirpList = ({ chirps, queryKeys }: ChirpListProps) => {
  const { user } = useUser() as { user: StoredUser };
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [chirpToReplyTo, setChirpToReplyTo] = useState<IChirp | null>(null);

  const {
    data: likedChirpIds,
    isError,
    isLoading,
  } = useLikedChirpIds(
    queryKeys,
    user._id,
    chirps.map((chirp) => chirp._id),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong</div>;
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
      {chirps.map((chirp) => {
        return (
          <Chirp
            key={chirp._id}
            chirp={chirp}
            isLiked={isChirpLiked(chirp._id)}
            onLike={() => handleLike(chirp._id)}
            onReply={() => handleReply(chirp)}
          />
        );
      })}
      <ComposeChirpModal
        chirp={chirpToReplyTo!}
        open={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
      />
    </>
  );
};

export default AuthenticatedChirpList;
