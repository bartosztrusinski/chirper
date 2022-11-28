import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import Modal from '../Modal';
import LikePrompt from '../Prompt/LikePrompt';
import ReplyPrompt from '../Prompt/ReplyPrompt';
import { forwardRef, useState } from 'react';

interface UnauthenticatedChirpListProps {
  chirps: IChirp[];
}

type LastChirpRef = HTMLElement | null;

const UnauthenticatedChirpList = forwardRef<
  LastChirpRef,
  UnauthenticatedChirpListProps
>(function UnauthenticatedChirpList({ chirps }, ref) {
  const [isLikeModalOpen, setIsLikeModalOpen] = useState<boolean>(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  const handleLike = (author: string) => {
    setSelectedAuthor(author);
    setIsLikeModalOpen(true);
  };

  const handleReply = (author: string) => {
    setSelectedAuthor(author);
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
            onLike={() => handleLike(chirp.author.username)}
            onReply={() => handleReply(chirp.author.username)}
          />
        );
      })}

      <Modal
        isOpen={isLikeModalOpen}
        onRequestClose={() => setIsLikeModalOpen(false)}
        title=' '
      >
        <LikePrompt username={selectedAuthor} />
      </Modal>

      <Modal
        isOpen={isReplyModalOpen}
        onRequestClose={() => setIsReplyModalOpen(false)}
        title=' '
      >
        <ReplyPrompt username={selectedAuthor} />
      </Modal>
    </>
  );
});

export default UnauthenticatedChirpList;
