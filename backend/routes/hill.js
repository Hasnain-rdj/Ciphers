const express = require('express');
const router = express.Router();
const HillCipher = require('../algorithms/hill');

// Encrypt endpoint
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, keyMatrix } = req.body;

    if (!plaintext || !keyMatrix) {
      return res.status(400).json({ error: 'Plaintext and keyMatrix are required' });
    }

    // Validate matrix
    if (!Array.isArray(keyMatrix) || keyMatrix.length === 0) {
      return res.status(400).json({ error: 'Invalid key matrix format' });
    }

    const n = keyMatrix.length;
    if (![2, 3, 4].includes(n)) {
      return res.status(400).json({ error: 'Matrix size must be 2x2, 3x3, or 4x4' });
    }

    // Validate square matrix
    for (let row of keyMatrix) {
      if (!Array.isArray(row) || row.length !== n) {
        return res.status(400).json({ error: 'Matrix must be square' });
      }
    }

    const cipher = new HillCipher(keyMatrix);
    const result = cipher.encrypt(plaintext);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decrypt endpoint
router.post('/decrypt', (req, res) => {
  try {
    const { ciphertext, keyMatrix } = req.body;

    if (!ciphertext || !keyMatrix) {
      return res.status(400).json({ error: 'Ciphertext and keyMatrix are required' });
    }

    // Validate matrix
    if (!Array.isArray(keyMatrix) || keyMatrix.length === 0) {
      return res.status(400).json({ error: 'Invalid key matrix format' });
    }

    const n = keyMatrix.length;
    if (![2, 3, 4].includes(n)) {
      return res.status(400).json({ error: 'Matrix size must be 2x2, 3x3, or 4x4' });
    }

    const cipher = new HillCipher(keyMatrix);
    const result = cipher.decrypt(ciphertext);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
