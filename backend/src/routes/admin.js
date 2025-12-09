import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUserFields } from '../validation.js';

const router = express.Router();

router.use(authenticate, authorize(['ADMIN']));

// Dashboard counts
router.get('/dashboard', async (req, res) => {
  try {
    const userCount = (await query('SELECT COUNT(*) FROM users')).rows[0].count;
    const storeCount = (await query('SELECT COUNT(*) FROM stores')).rows[0].count;
    const ratingCount = (await query('SELECT COUNT(*) FROM ratings')).rows[0].count;

    res.json({ userCount: Number(userCount), storeCount: Number(storeCount), ratingCount: Number(ratingCount) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new user (admin/normal/owner)
router.post('/users', async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!['ADMIN', 'USER', 'OWNER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const errors = validateUserFields({ name, email, address, password });
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const existing = await query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [name, email, hash, address, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List users with filters
router.get('/users', async (req, res) => {
  try {
    const { name = '', email = '', address = '', role = '', sortBy = 'name', order = 'asc' } = req.query;
    const sortAllowed = ['name', 'email', 'address', 'role'];
    const sort = sortAllowed.includes(sortBy) ? sortBy : 'name';
    const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const params = [
      `%${name}%`,
      `%${email}%`,
      `%${address}%`
    ];
    let sql = `SELECT id, name, email, address, role FROM users
               WHERE name ILIKE $1 AND email ILIKE $2 AND address ILIKE $3`;

    if (role) {
      params.push(role);
      sql += ` AND role = $4`;
    }

    sql += ` ORDER BY ${sort} ${ord}`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List stores
router.get('/stores', async (req, res) => {
  try {
    const { name = '', email = '', address = '', sortBy = 'name', order = 'asc' } = req.query;
    const sortAllowed = ['name', 'email', 'address', 'avg_rating'];
    const sort = sortAllowed.includes(sortBy) ? sortBy : 'name';
    const ord = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const params = [
      `%${name}%`,
      `%${email}%`,
      `%${address}%`
    ];

    let sql = `SELECT id, name, email, address, avg_rating, rating_count
               FROM stores
               WHERE name ILIKE $1 AND email ILIKE $2 AND address ILIKE $3
               ORDER BY ${sort} ${ord}`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details (with rating if store owner)
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userRes = await query('SELECT id, name, email, address, role FROM users WHERE id=$1', [id]);
    if (!userRes.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userRes.rows[0];

    if (user.role === 'OWNER') {
      const storeRes = await query(
        'SELECT id, name, email, address, avg_rating, rating_count FROM stores WHERE owner_id=$1',
        [id]
      );
      user.store = storeRes.rows[0] || null;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new store
router.post('/stores', async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }
    if (name.length < 3 || name.length > 100) {
      return res.status(400).json({ message: 'Store name length invalid' });
    }
    if (address.length > 400) {
      return res.status(400).json({ message: 'Address must be at most 400 characters' });
    }

    let owner_id = null;
    if (ownerId) {
      const ownerRes = await query('SELECT id FROM users WHERE id=$1 AND role=$2', [ownerId, 'OWNER']);
      if (!ownerRes.rows.length) {
        return res.status(400).json({ message: 'Owner not found or not OWNER role' });
      }
      owner_id = ownerId;
    }

    const result = await query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id, avg_rating, rating_count`,
      [name, email || null, address, owner_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;