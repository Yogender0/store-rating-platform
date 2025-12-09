import express from 'express';
import { query } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize(['USER']));

// List stores with overall + user's rating
router.get('/stores', async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchName = '', searchAddress = '', sortBy = 'name', order = 'asc' } = req.query;
    const sortAllowed = ['name', 'avg_rating'];
    const sort = sortAllowed.includes(sortBy) ? sortBy : 'name';
    const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const result = await query(
      `SELECT s.id,
              s.name,
              s.address,
              s.avg_rating,
              s.rating_count,
              r.rating AS user_rating
       FROM stores s
       LEFT JOIN ratings r
         ON r.store_id = s.id AND r.user_id = $3
       WHERE s.name ILIKE $1 AND s.address ILIKE $2
       ORDER BY ${sort} ${ord}`,
      [`%${searchName}%`, `%${searchAddress}%`, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit or update rating
router.post('/stores/:storeId/ratings', async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;

    const value = Number(rating);
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const storeRes = await query('SELECT id FROM stores WHERE id=$1', [storeId]);
    if (!storeRes.rows.length) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existing = await query(
      'SELECT id FROM ratings WHERE user_id=$1 AND store_id=$2',
      [userId, storeId]
    );

    if (existing.rows.length) {
      await query(
        'UPDATE ratings SET rating=$1, updated_at=NOW() WHERE user_id=$2 AND store_id=$3',
        [value, userId, storeId]
      );
    } else {
      await query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
        [userId, storeId, value]
      );
    }

    // Recalculate avg
    const agg = await query(
      'SELECT AVG(rating)::NUMERIC(3,2) AS avg_rating, COUNT(*) AS rating_count FROM ratings WHERE store_id=$1',
      [storeId]
    );
    const { avg_rating, rating_count } = agg.rows[0];
    await query(
      'UPDATE stores SET avg_rating=$1, rating_count=$2 WHERE id=$3',
      [avg_rating || 0, rating_count || 0, storeId]
    );

    res.json({ message: 'Rating saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;