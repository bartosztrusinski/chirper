import ChirpList from '../ChirpList';
import ChirpService from '../../api/services/Chirp';
import { useQuery } from '@tanstack/react-query';

interface UserTimelineProps {
  username: string;
}

const UserTimeline = ({ username }: UserTimelineProps) => {
  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps', username, 'timeline'], () => ChirpService.getMany());

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>
        Error:
        {error instanceof Error
          ? error.message
          : 'Oops, something went wrong...'}
      </p>
    );
  }

  return <ChirpList chirps={chirps.data} />;
};

export default UserTimeline;
