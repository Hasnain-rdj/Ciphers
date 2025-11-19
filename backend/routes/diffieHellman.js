const express = require('express');
const router = express.Router();
const DiffieHellman = require('../algorithms/diffieHellman');

// Generate keys and shared secret
router.post('/generate', (req, res) => {
  try {
    const { p, g, privateA, privateB } = req.body;

    if (!p || !g || !privateA || !privateB) {
      return res.status(400).json({ 
        error: 'Prime (p), primitive root (g), and both private keys are required' 
      });
    }

    const result = DiffieHellman.generateKeys(p, g, privateA, privateB);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
