const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const playfairRoutes = require('./routes/playfair');
const hillRoutes = require('./routes/hill');
const vigenereRoutes = require('./routes/vigenere');
const aesRoutes = require('./routes/aes');
const desRoutes = require('./routes/des');
const dhRoutes = require('./routes/diffieHellman');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/playfair', playfairRoutes);
app.use('/api/hill', hillRoutes);
app.use('/api/vigenere', vigenereRoutes);
app.use('/api/aes', aesRoutes);
app.use('/api/des', desRoutes);
app.use('/api/dh', dhRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cryptography API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
