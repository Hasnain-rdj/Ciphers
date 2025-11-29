import { useState } from 'react';
import { Lock, Unlock, Copy, Check, Info } from 'lucide-react';
import axios from 'axios';
import './CipherComponent.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function DES() {
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
      const response = await axios.post(`${API_URL}/des/encrypt`, {
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
      alert('Please enter both ciphertext (hex) and key');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/des/decrypt`, {
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
        <h2>DES Encryption</h2>
        <p>Data Encryption Standard with 64-bit key (16 Feistel rounds)</p>
      </div>

      <div className="info-banner">
        <Info size={18} />
        <span>DES uses 64-bit key (16 hexadecimal characters). Output is in hexadecimal format.</span>
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
          <label>Key (16 hex characters for 64-bit)</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter 16-character hex key (e.g., 133457799BBCDFF1)"
            maxLength={16}
          />
          <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            Key length: {key.length}/16 hex characters
          </small>
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
              <label>Ciphertext (Hex)</label>
              <div className="output-box hex-output">
                {ciphertext || 'Result will appear here'}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Ciphertext (Hex)</label>
              <textarea
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                placeholder="Enter hex ciphertext to decrypt"
                className="hex-input"
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

      {result && (
        <div className="result-section">
          <h3>Hexadecimal Values</h3>
          <div className="hex-display-grid">
            {result.keyHex && (
              <div className="hex-item">
                <strong>Key (Hex):</strong>
                <div className="hex-value">{result.keyHex}</div>
              </div>
            )}
            {result.plaintextHex && (
              <div className="hex-item">
                <strong>Plaintext (Hex):</strong>
                <div className="hex-value">{result.plaintextHex}</div>
              </div>
            )}
          </div>

          {result.steps && result.steps.length > 0 && (
            <>
              <h3>DES Process Overview</h3>
              <div className="steps-display">
                {result.steps.map((step, i) => (
                  <div key={i} className="step-item-detailed">
                    <div className="step-header">{step.operation}</div>
                    <div className="step-content">
                      {step.data && <div className="hex-value">{step.data}</div>}
                      <div className="step-desc">{step.description}</div>
                      {step.note && <div className="step-note">{step.note}</div>}
                    </div>
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

export default DES;
