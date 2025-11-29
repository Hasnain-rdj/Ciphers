import { useState } from 'react';
import { Lock, Unlock, Copy, Check, Info } from 'lucide-react';
import axios from 'axios';
import './CipherComponent.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Vigenere() {
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
      const response = await axios.post(`${API_URL}/vigenere/encrypt`, {
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
      const response = await axios.post(`${API_URL}/vigenere/decrypt`, {
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
        <h2>Vigenère Cipher</h2>
        <p>Polyalphabetic substitution cipher using a keyword</p>
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
            placeholder="Enter key (e.g., CRYPTO)"
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

      {result && result.repeatedKey && (
        <div className="result-section">
          <h3>Key Information</h3>
          <div className="info-box">
            <div className="info-row">
              <strong>Original Key:</strong> {result.key}
            </div>
            <div className="info-row">
              <strong>Repeated Key:</strong> {result.repeatedKey}
            </div>
          </div>

          {result.steps && result.steps.length > 0 && (
            <>
              <h3>Example Steps (First 3 characters)</h3>
              <div className="steps-display">
                {result.steps.map((step, i) => (
                  <div key={i} className="step-item-detailed">
                    <div className="step-header">Position {step.position}</div>
                    <div className="step-content">
                      <div>
                        <strong>{mode === 'encrypt' ? 'Plain' : 'Cipher'}:</strong> {mode === 'encrypt' ? step.plainChar : step.cipherChar} ({mode === 'encrypt' ? step.plainValue : step.cipherValue})
                      </div>
                      <div>
                        <strong>Key:</strong> {step.keyChar} ({step.keyValue})
                      </div>
                      <div className="calc-formula">
                        {step.calculation}
                      </div>
                      <div>
                        <strong>Result:</strong> {mode === 'encrypt' ? step.cipherChar : step.plainChar}
                      </div>
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

export default Vigenere;
