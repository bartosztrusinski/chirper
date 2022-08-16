import { Router } from 'express';
import {
  getAllUsers,
  signUpUser,
  logInUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user';

const router = Router();

router.get('/', getAllUsers);

router.post('/', signUpUser);

router.post('/login', logInUser);

router.get('/:userID', getUser);

router.put('/:userID', updateUser);

router.delete('/:userID', deleteUser);

export default router;
