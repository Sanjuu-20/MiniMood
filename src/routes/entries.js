import express from 'express';
import { query } from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { entrySchema, paginationSchema, dateRangeSchema } from '../validation/schemas.js';
import { getMoodById } from '../data/moods.js';

const router = express.Router();

function formatDateYMD(date) {
  if (!date) return null;
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  const d = new Date(date);
  return getLocalDateString(d);
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

router.use(authenticate);

router.post('/', validate(entrySchema), async (req, res) => {
  try {
    const { mood_id, note } = req.body;
    const userId = req.user.id;
    
    const entryDate = req.body.entry_date || getLocalDateString();

    const result = await query(
      `INSERT INTO entries (user_id, entry_date, mood_id, note)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, entry_date) 
       DO UPDATE SET mood_id = $3, note = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING id, entry_date, mood_id, note, created_at, updated_at`,
      [userId, entryDate, mood_id, note || '']
    );

    const entry = result.rows[0];
    const mood = getMoodById(entry.mood_id);

    res.status(201).json({
      message: 'Entry saved',
      entry: {
        ...entry,
        entry_date: formatDateYMD(entry.entry_date),
        mood
      }
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

router.get('/', validateQuery(paginationSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT id, entry_date, mood_id, note, created_at, updated_at
       FROM entries 
       WHERE user_id = $1 
       ORDER BY entry_date DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM entries WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].total);

    const entries = result.rows.map(entry => ({
      ...entry,
      entry_date: formatDateYMD(entry.entry_date),
      mood: getMoodById(entry.mood_id)
    }));

    res.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ error: 'Failed to get entries' });
  }
});

router.get('/today', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getLocalDateString();

    const result = await query(
      `SELECT id, entry_date, mood_id, note, created_at, updated_at
       FROM entries 
       WHERE user_id = $1 AND entry_date = $2`,
      [userId, today]
    );

    if (result.rows.length === 0) {
      return res.json({ entry: null });
    }

    const entry = result.rows[0];
    res.json({
      entry: {
        ...entry,
        entry_date: formatDateYMD(entry.entry_date),
        mood: getMoodById(entry.mood_id)
      }
    });
  } catch (error) {
    console.error('Get today entry error:', error);
    res.status(500).json({ error: 'Failed to get today\'s entry' });
  }
});

router.get('/range', validateQuery(dateRangeSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    const result = await query(
      `SELECT id, entry_date, mood_id, note, created_at
       FROM entries 
       WHERE user_id = $1 AND entry_date >= $2 AND entry_date <= $3
       ORDER BY entry_date ASC`,
      [userId, start_date, end_date]
    );

    const entries = result.rows.map(entry => ({
      ...entry,
      entry_date: formatDateYMD(entry.entry_date),
      mood: getMoodById(entry.mood_id)
    }));

    res.json({ entries });
  } catch (error) {
    console.error('Get range error:', error);
    res.status(500).json({ error: 'Failed to get entries' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    const moodStats = await query(
      `SELECT mood_id, COUNT(*) as count
       FROM entries 
       WHERE user_id = $1
       GROUP BY mood_id
       ORDER BY count DESC`,
      [userId]
    );

    const totalResult = await query(
      'SELECT COUNT(*) as total FROM entries WHERE user_id = $1',
      [userId]
    );

    const streakResult = await query(
      `WITH date_sequence AS (
        SELECT entry_date, 
               entry_date - (ROW_NUMBER() OVER (ORDER BY entry_date))::int AS grp
        FROM entries 
        WHERE user_id = $1
      )
      SELECT COUNT(*) as streak_length, MIN(entry_date) as start_date, MAX(entry_date) as end_date
      FROM date_sequence
      GROUP BY grp
      ORDER BY end_date DESC
      LIMIT 1`,
      [userId]
    );

    const today = getLocalDateString();
    const todayCheck = await query(
      'SELECT 1 FROM entries WHERE user_id = $1 AND entry_date = $2',
      [userId, today]
    );

    const moodFrequency = moodStats.rows.map(row => ({
      mood: getMoodById(parseInt(row.mood_id)),
      count: parseInt(row.count)
    }));

    let currentStreak = 0;
    if (streakResult.rows.length > 0) {
      const lastEntry = streakResult.rows[0].end_date;
      const lastEntryDate = formatDateYMD(lastEntry);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday);

      if (lastEntryDate === today || lastEntryDate === yesterdayStr) {
        currentStreak = parseInt(streakResult.rows[0].streak_length);
      }
    }

    res.json({
      stats: {
        totalEntries: parseInt(totalResult.rows[0].total),
        currentStreak,
        loggedToday: todayCheck.rows.length > 0,
        moodFrequency
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

router.get('/:date', async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const result = await query(
      `SELECT id, entry_date, mood_id, note, created_at, updated_at
       FROM entries 
       WHERE user_id = $1 AND entry_date = $2`,
      [userId, date]
    );

    if (result.rows.length === 0) {
      return res.json({ entry: null });
    }

    const entry = result.rows[0];
    res.json({
      entry: {
        ...entry,
        entry_date: formatDateYMD(entry.entry_date),
        mood: getMoodById(entry.mood_id)
      }
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({ error: 'Failed to get entry' });
  }
});

router.delete('/:date', async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const result = await query(
      'DELETE FROM entries WHERE user_id = $1 AND entry_date = $2 RETURNING id',
      [userId, date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;
