import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import Heading from '../../components/ui/Heading';
import MutedText from '../../components/ui/MutedText';
import { useNavigate } from '@tanstack/react-location';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Heading size='small'>Hmm... this page doesn&apos;t exist 🤔</Heading>
      <MutedText>Try searching for something else</MutedText>
      <Button
        style={{ marginTop: '0.75rem' }}
        onClick={() => navigate({ to: '/search', search: true })}
      >
        Search
      </Button>
    </Container>
  );
};

export default NotFound;
