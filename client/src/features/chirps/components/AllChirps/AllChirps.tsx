import ChirpList from '../ChirpList';
import { useAllChirpsQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';

const AllChirps = () => {
  return (
    <section>
      <h1 className='visually-hidden'>Explore</h1>
      <ChirpList
        queryKeys={chirpKeys.list('all')}
        queryData={useAllChirpsQuery()}
      />
    </section>
  );
};

export default AllChirps;
