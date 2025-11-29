const express = require('express');
const router = express.Router();
const HillCipher = require('../algorithms/hill');
const ValidationHelper = require('../utils/validation');

// Encrypt endpoint
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, keyMatrix } = req.body;

    // Validate plaintext
    const plaintextValidation = ValidationHelper.validateClassicalPlaintext(plaintext, 'Hill cipher');
    if (!plaintextValidation.valid) {
      return res.status(400).json({ error: plaintextValidation.message });
    }

    // Validate matrix
    if (!keyMatrix) {
      return res.status(400).json({ error: 'Key matrix is required for Hill cipher. Please enter a matrix of numbers.' });
    }
    
    if (!Array.isArray(keyMatrix) || keyMatrix.length === 0) {
      return res.status(400).json({ error: 'Invalid key matrix format. Matrix must be a 2D array of numbers.' });
    }

    const n = keyMatrix.length;
    if (![2, 3, 4].includes(n)) {
      return res.status(400).json({ error: `Matrix size must be 2x2, 3x3, or 4x4. You provided a ${n}x${n} matrix.` });
    }

    // Validate square matrix
    for (let i = 0; i < keyMatrix.length; i++) {
      if (!Array.isArray(keyMatrix[i]) || keyMatrix[i].length !== n) {
        return res.status(400).json({ error: `Matrix must be square. Row ${i+1} has ${keyMatrix[i]?.length || 0} elements but should have ${n}.` });
      }
      for (let j = 0; j < keyMatrix[i].length; j++) {
        if (typeof keyMatrix[i][j] !== 'number' || isNaN(keyMatrix[i][j])) {
          return res.status(400).json({ error: `Invalid matrix value at position [${i+1},${j+1}]. All values must be numbers.` });
        }
      }
    }

    const cipher = new HillCipher(keyMatrix);
    const result = cipher.encrypt(plaintext);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    if (error.message.includes('not invertible')) {
      return res.status(400).json({ error: 'Matrix is not invertible (determinant is 0 or has no modular inverse). Please use a different matrix.' });
    }
    res.status(500).json({ error: 'Encryption failed: ' + error.message });
  }
});

// Decrypt endpoint
router.post('/decrypt', (req, res) => {
  try {
    const { ciphertext, keyMatrix } = req.body;

    // Validate ciphertext
    if (!ciphertext || ciphertext.trim() === '') {
      return res.status(400).json({ error: 'Ciphertext is required for decryption. Please enter the encrypted text.' });
    }
    if (!ValidationHelper.isAlphabetic(ciphertext)) {
      return res.status(400).json({ error: 'Ciphertext must contain only alphabetic characters (A-Z).' });
    }

    // Validate matrix
    if (!keyMatrix) {
      return res.status(400).json({ error: 'Key matrix is required for Hill cipher decryption.' });
    }
    
    if (!Array.isArray(keyMatrix) || keyMatrix.length === 0) {
      return res.status(400).json({ error: 'Invalid key matrix format. Matrix must be a 2D array of numbers.' });
    }

    const n = keyMatrix.length;
    if (![2, 3, 4].includes(n)) {
      return res.status(400).json({ error: `Matrix size must be 2x2, 3x3, or 4x4. You provided a ${n}x${n} matrix.` });
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
