import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import { forwardRef, useContext } from 'react';
import { PromptContext } from '../UnauthenticatedApp';

interface UnauthenticatedChirpListProps {
  chirps: IChirp[];
}

type LastChirpRef = HTMLElement | null;

const UnauthenticatedChirpList = forwardRef<
  LastChirpRef,
  UnauthenticatedChirpListProps
>(function UnauthenticatedChirpList({ chirps }, ref) {
  const { openLikePrompt } = useContext(PromptContext) as PromptContext;

  return (
    <>
      {chirps.map((chirp, index) => {
        const isLastChirp = index === chirps.length - 1;

        return (
          <Chirp
            ref={isLastChirp ? ref : null}
            key={chirp._id}
            chirp={chirp}
            onLike={() => openLikePrompt(chirp.author.username)}
          />
        );
      })}
    </>
  );
});

export default UnauthenticatedChirpList;
