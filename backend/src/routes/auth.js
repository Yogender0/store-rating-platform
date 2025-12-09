import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../db.js';
import { validateUserFields } from '../validation.js';
import { authenticate } from '../middleware/auth.js';

dotenv.config();
const router = express.Router();

// Normal user signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    const errors = validateUserFields({ name, email, address, password });
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const existing = await query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'USER') RETURNING id, name, email, role`,
      [name, email, hash, address]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login for all roles
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password (all roles)
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'newPassword is required' });
    }
    const errors = validateUserFields({
      name: 'x'.repeat(20),
      email: 'a@a.com',
      address: 'addr',
      password: newPassword
    });
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash=$1 WHERE id=$2', [
      hash,
      req.user.id
    ]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;