import express from 'express';
import { query } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize(['OWNER']));

// Owner dashboard: own store + ratings
router.get('/dashboard', async (req, res) => {
  try {
    const ownerId = req.user.id;

    const storeRes = await query(
      'SELECT id, name, email, address, avg_rating, rating_count FROM stores WHERE owner_id=$1',
      [ownerId]
    );
    const store = storeRes.rows[0];
    if (!store) {
      return res.json({ store: null, ratings: [] });
    }

    const ratingsRes = await query(
      `SELECT u.name AS user_name, u.email AS user_email, r.rating
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id=$1`,
      [store.id]
    );

    res.json({ store, ratings: ratingsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;