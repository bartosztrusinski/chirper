import { AllChirps } from '../../features/chirps';
import { useEffect } from 'react';

const Explore = () => {
  useEffect(() => {
    document.title = 'Explore';
  }, []);

  return <AllChirps />;
};

export default Explore;
