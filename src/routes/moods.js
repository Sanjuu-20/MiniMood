import express from 'express';
import { getAllMoods, getMoodById } from '../data/moods.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ moods: getAllMoods() });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const mood = getMoodById(id);
  
  if (!mood) {
    return res.status(404).json({ error: 'Mood not found' });
  }
  
  res.json({ mood });
});

export default router;
