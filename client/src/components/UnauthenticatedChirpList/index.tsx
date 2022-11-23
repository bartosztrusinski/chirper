import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import LikePrompt from '../Prompt/LikePrompt';
import { useState } from 'react';
import Modal from '../Modal';
import ReplyPrompt from '../Prompt/ReplyPrompt';

interface ChirpListProps {
  chirps: IChirp[];
}

const UnauthenticatedChirpList = ({ chirps }: ChirpListProps) => {
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [author, setAuthor] = useState('');

  const handleLike = (author: string) => {
    setAuthor(author);
    setIsLikeModalOpen(true);
  };

  const handleReply = (author: string) => {
    setAuthor(author);
    setIsReplyModalOpen(true);
  };

  return (
    <>
      {chirps.map((chirp) => {
        return (
          <Chirp
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
        <LikePrompt username={author} />
      </Modal>
      <Modal
        isOpen={isReplyModalOpen}
        onRequestClose={() => setIsReplyModalOpen(false)}
        title=' '
      >
        <ReplyPrompt username={author} />
      </Modal>
    </>
  );
};

export default UnauthenticatedChirpList;
