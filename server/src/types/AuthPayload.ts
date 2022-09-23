import { JwtPayload } from 'jsonwebtoken';

interface AuthPayload extends JwtPayload {
  currentUserId: string;
}

export default AuthPayload;
