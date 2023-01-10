import { useEffect } from 'react';
import ChirpService from '../../api/services/Chirp';
import ChirpList from '../ChirpList';

const Explore = () => {
  const queryKeys = ['all'];

  useEffect(() => {
    document.title = 'Explore';
  }, []);

  return (
    <section>
      <h1 className='visually-hidden'>Explore</h1>
      <ChirpList
        queryKeys={queryKeys}
        queryFn={(sinceId?: string) => ChirpService.getMany(sinceId)}
      />
    </section>
  );
};

export default Explore;
