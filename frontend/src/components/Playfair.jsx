import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Copy, Check, Info } from 'lucide-react';
import axios from 'axios';
import './CipherComponent.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Playfair() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('encrypt');
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!plaintext || !key) {
      alert('Please enter both plaintext and key');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/playfair/encrypt`, {
        plaintext,
        key
      });
      setResult(response.data);
      setCiphertext(response.data.ciphertext);
    } catch (error) {
      alert('Encryption failed: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !key) {
      alert('Please enter both ciphertext and key');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/playfair/decrypt`, {
        ciphertext,
        key
      });
      setResult(response.data);
      setPlaintext(response.data.plaintext);
    } catch (error) {
      alert('Decryption failed: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cipher-container">
      <div className="cipher-header">
        <h2>Playfair Cipher</h2>
        <p>A digraph substitution cipher using a 5×5 key matrix</p>
      </div>

      <div className="info-banner">
        <Info size={18} />
        <span>Key and plaintext must contain only alphabetic characters (A-Z). Non-alphabetic characters will be rejected.</span>
      </div>

      <div className="mode-toggle">
        <button
          className={mode === 'encrypt' ? 'active' : ''}
          onClick={() => setMode('encrypt')}
        >
          <Lock size={18} /> Encrypt
        </button>
        <button
          className={mode === 'decrypt' ? 'active' : ''}
          onClick={() => setMode('decrypt')}
        >
          <Unlock size={18} /> Decrypt
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter key (e.g., MONARCHY)"
          />
        </div>

        {mode === 'encrypt' ? (
          <>
            <div className="form-group">
              <label>Plaintext</label>
              <textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter text to encrypt"
              />
            </div>
            <div className="form-group">
              <label>Ciphertext</label>
              <div className="output-box">
                {ciphertext || 'Result will appear here'}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Ciphertext</label>
              <textarea
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                placeholder="Enter text to decrypt"
              />
            </div>
            <div className="form-group">
              <label>Plaintext</label>
              <div className="output-box">
                {plaintext || 'Result will appear here'}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="button-group">
        {mode === 'encrypt' ? (
          <button
            onClick={handleEncrypt}
            disabled={loading}
          >
            {loading ? 'Encrypting...' : 'Encrypt'}
          </button>
        ) : (
          <button
            onClick={handleDecrypt}
            disabled={loading}
          >
            {loading ? 'Decrypting...' : 'Decrypt'}
          </button>
        )}
        
        {(ciphertext || plaintext) && (
          <button
            className="secondary"
            onClick={() => copyToClipboard(mode === 'encrypt' ? ciphertext : plaintext)}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        )}
      </div>

      {result && result.matrix && (
        <div className="result-section">
          <h3>Key Matrix (5×5)</h3>
          <div className="matrix-display">
            {result.matrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((char, j) => (
                  <div key={j} className="matrix-cell">
                    {char}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {result.steps && result.steps.length > 0 && (
            <>
              <h3>Example Steps</h3>
              <div className="steps-display">
                {result.steps.slice(0, 3).map((step, i) => (
                  <div key={i} className="step-item">
                    <span className="step-number">{i + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Playfair;
