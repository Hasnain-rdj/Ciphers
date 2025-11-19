const express = require('express');
const router = express.Router();
const VigenereCipher = require('../algorithms/vigenere');

// Encrypt endpoint
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, key } = req.body;

    if (!plaintext || !key) {
      return res.status(400).json({ error: 'Plaintext and key are required' });
    }

    const cipher = new VigenereCipher(key);
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
    const { ciphertext, key } = req.body;

    if (!ciphertext || !key) {
      return res.status(400).json({ error: 'Ciphertext and key are required' });
    }

    const cipher = new VigenereCipher(key);
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
