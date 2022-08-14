import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userID', getUser);

router.put('/:userID', updateUser);

router.delete('/:userID', deleteUser);

export default router;
