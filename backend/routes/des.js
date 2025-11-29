const express = require('express');
const router = express.Router();
const DESCipher = require('../algorithms/des');
const ValidationHelper = require('../utils/validation');

// Encrypt endpoint
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, key } = req.body;

    if (!plaintext || plaintext.trim() === '') {
      return res.status(400).json({ error: 'Plaintext is required for DES encryption. Please enter the text you want to encrypt.' });
    }

    const keyValidation = ValidationHelper.validateDESKey(key);
    if (!keyValidation.valid) {
      return res.status(400).json({ error: keyValidation.message });
    }

    const result = DESCipher.encrypt(plaintext, key);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'DES encryption failed: ' + error.message });
  }
});

// Decrypt endpoint
router.post('/decrypt', (req, res) => {
  try {
    const { ciphertext, key } = req.body;

    if (!ciphertext || ciphertext.trim() === '') {
      return res.status(400).json({ error: 'Ciphertext is required for DES decryption. Please enter the encrypted text.' });
    }

    const keyValidation = ValidationHelper.validateDESKey(key);
    if (!keyValidation.valid) {
      return res.status(400).json({ error: keyValidation.message });
    }

    const result = DESCipher.decrypt(ciphertext, key);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'DES decryption failed. Please check your key is correct. ' + error.message });
  }
});

module.exports = router;
