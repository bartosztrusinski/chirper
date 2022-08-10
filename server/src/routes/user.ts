import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'All users are here' });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'New user created' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} found` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} updated` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
});

export default router;
