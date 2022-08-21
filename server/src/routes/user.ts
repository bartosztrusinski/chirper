import { Router } from 'express';
import {
  getAllUsers,
  signUpUser,
  logInUser,
  getUser,
  // updateUser,
  // deleteUser,
} from '../controllers/user';
// import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', getAllUsers);

router.post('/', signUpUser);

router.post('/login', logInUser);

router.get('/:username', getUser);

// router.put('/:username', isAuthenticated, updateUser); // me route?

// router.delete('/:username', isAuthenticated, deleteUser); // me route?

export default router;
