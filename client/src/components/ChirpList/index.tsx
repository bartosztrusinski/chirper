import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';

interface ChirpListProps {
  chirps: IChirp[];
}

const ChirpList = ({ chirps }: ChirpListProps) => {
  return (
    <>
      {chirps.map((chirp) => {
        return <Chirp key={chirp._id} chirp={chirp} />;
      })}
    </>
  );
};

export default ChirpList;
