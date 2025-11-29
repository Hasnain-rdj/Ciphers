const express = require('express');
const router = express.Router();
const DiffieHellman = require('../algorithms/diffieHellman');
const ValidationHelper = require('../utils/validation');

// Generate keys and shared secret
router.post('/generate', (req, res) => {
  try {
    const { p, g, privateA, privateB } = req.body;

    // Validate prime number p
    const pValidation = ValidationHelper.validatePrime(p);
    if (!pValidation.valid) {
      return res.status(400).json({ error: pValidation.message });
    }

    // Validate generator g
    const gValidation = ValidationHelper.validateGenerator(g, p);
    if (!gValidation.valid) {
      return res.status(400).json({ error: gValidation.message });
    }

    // Validate private key A
    const privateAValidation = ValidationHelper.validatePrivateKey(privateA, p, 'Private key A');
    if (!privateAValidation.valid) {
      return res.status(400).json({ error: privateAValidation.message });
    }

    // Validate private key B
    const privateBValidation = ValidationHelper.validatePrivateKey(privateB, p, 'Private key B');
    if (!privateBValidation.valid) {
      return res.status(400).json({ error: privateBValidation.message });
    }

    const result = DiffieHellman.generateKeys(p, g, privateA, privateB);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'Key generation failed: ' + error.message });
  }
});

module.exports = router;
