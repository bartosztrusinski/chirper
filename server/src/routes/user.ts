import { Router } from 'express';
import {
  getAllUsers,
  signUpUser,
  logInUser,
  getUser,
  updateUser,
  deleteUser,
  getLoggedInUser,
} from '../controllers/user';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', getAllUsers);

router.post('/', signUpUser);

router.post('/login', logInUser);

router.get('/me', isAuthenticated, getLoggedInUser);

router.get('/:userID', getUser);

router.put('/:userID', updateUser);

router.delete('/:userID', deleteUser);

export default router;
