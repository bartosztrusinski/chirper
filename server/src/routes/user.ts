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

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
