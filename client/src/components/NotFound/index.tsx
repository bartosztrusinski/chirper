import { useNavigate } from '@tanstack/react-location';
import Button from '../Button';
import Container from '../Container';
import MutedText from '../MutedText';
import Heading from '../Heading';

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
