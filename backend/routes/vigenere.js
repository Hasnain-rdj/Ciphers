const express = require('express');
const router = express.Router();
const VigenereCipher = require('../algorithms/vigenere');
const ValidationHelper = require('../utils/validation');

// Encrypt endpoint
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, key } = req.body;

    // Validate plaintext
    const plaintextValidation = ValidationHelper.validateClassicalPlaintext(plaintext, 'Vigenère cipher');
    if (!plaintextValidation.valid) {
      return res.status(400).json({ error: plaintextValidation.message });
    }

    // Validate key
    const keyValidation = ValidationHelper.validateClassicalKey(key, 'Vigenère cipher', 1);
    if (!keyValidation.valid) {
      return res.status(400).json({ error: keyValidation.message });
    }

    const cipher = new VigenereCipher(key);
    const result = cipher.encrypt(plaintext);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'Encryption failed: ' + error.message });
  }
});

// Decrypt endpoint
router.post('/decrypt', (req, res) => {
  try {
    const { ciphertext, key } = req.body;

    // Validate ciphertext
    if (!ciphertext || ciphertext.trim() === '') {
      return res.status(400).json({ error: 'Ciphertext is required for decryption. Please enter the encrypted text.' });
    }
    if (!ValidationHelper.isAlphabetic(ciphertext)) {
      return res.status(400).json({ error: 'Ciphertext must contain only alphabetic characters (A-Z).' });
    }

    // Validate key
    const keyValidation = ValidationHelper.validateClassicalKey(key, 'Vigenère cipher', 1);
    if (!keyValidation.valid) {
      return res.status(400).json({ error: keyValidation.message });
    }

    const cipher = new VigenereCipher(key);
    const result = cipher.decrypt(ciphertext);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'Decryption failed: ' + error.message });
  }
});

module.exports = router;
