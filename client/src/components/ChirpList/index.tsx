import { forwardRef, useContext } from 'react';
import useLikeChirp from '../../hooks/useLikeChirp';
import useUser from '../../hooks/useUser';
import Chirp from '../Chirp';
import { PromptContext } from '../UnauthenticatedApp';

interface ChirpListProps {
  chirps: Chirp[];
  heading?: string;
  queryKeys: unknown[];
}

const ChirpList = forwardRef<HTMLElement, ChirpListProps>(function ChirpList(
  { chirps, heading, queryKeys },
  ref,
) {
  const promptContext = useContext(PromptContext);
  const { user: currentUser } = useUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

  const handleLike = (chirp: Chirp) => {
    if (!currentUser) {
      promptContext?.openLikePrompt(chirp.author.username);
    } else if (chirp.isLiked) {
      unlikeChirp(chirp);
    } else {
      likeChirp(chirp);
    }
  };

  const handleRef = (chirpIndex: number) =>
    chirpIndex === chirps.length - 1 ? ref : null;

  return (
    <section>
      {heading && <h1 className='visually-hidden'>{heading}</h1>}
      {chirps.map((chirp, index) => (
        <Chirp
          key={chirp._id}
          ref={handleRef(index)}
          chirp={chirp}
          onLike={() => handleLike(chirp)}
        />
      ))}
    </section>
  );
});

export default ChirpList;
