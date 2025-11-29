const express = require('express');
const router = express.Router();
const AESCipher = require('../algorithms/aes');
const ValidationHelper = require('../utils/validation');

// Encrypt endpoint
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, key } = req.body;

    if (!plaintext || plaintext.trim() === '') {
      return res.status(400).json({ error: 'Plaintext is required for AES encryption. Please enter the text you want to encrypt.' });
    }

    const keyValidation = ValidationHelper.validateAESKey(key);
    if (!keyValidation.valid) {
      return res.status(400).json({ error: keyValidation.message });
    }

    const result = AESCipher.encrypt(plaintext, key);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'AES encryption failed: ' + error.message });
  }
});

// Decrypt endpoint
router.post('/decrypt', (req, res) => {
  try {
    const { ciphertext, key, iv } = req.body;

    if (!ciphertext || ciphertext.trim() === '') {
      return res.status(400).json({ error: 'Ciphertext is required for AES decryption. Please enter the encrypted text.' });
    }

    if (!iv || iv.trim() === '') {
      return res.status(400).json({ error: 'IV (Initialization Vector) is required for AES decryption.' });
    }

    const keyValidation = ValidationHelper.validateAESKey(key);
    if (!keyValidation.valid) {
      return res.status(400).json({ error: keyValidation.message });
    }

    const result = AESCipher.decrypt(ciphertext, key, iv);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'AES decryption failed. Please check your key and IV are correct. ' + error.message });
  }
});

module.exports = router;
