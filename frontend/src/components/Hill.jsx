import { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import axios from 'axios';
import './CipherComponent.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Hill() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [matrixSize, setMatrixSize] = useState(2);
  const [keyMatrix, setKeyMatrix] = useState([[3, 3], [2, 5]]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('encrypt');
  const [copied, setCopied] = useState(false);

  const handleMatrixSizeChange = (size) => {
    setMatrixSize(size);
    if (size === 2) {
      setKeyMatrix([[3, 3], [2, 5]]);
    } else if (size === 3) {
      setKeyMatrix([[6, 24, 1], [13, 16, 10], [20, 17, 15]]);
    } else if (size === 4) {
      setKeyMatrix([[6, 24, 1, 13], [13, 16, 10, 20], [20, 17, 15, 7], [8, 4, 22, 11]]);
    }
  };

  const handleMatrixChange = (i, j, value) => {
    const newMatrix = keyMatrix.map(row => [...row]);
    newMatrix[i][j] = parseInt(value) || 0;
    setKeyMatrix(newMatrix);
  };

  const handleEncrypt = async () => {
    if (!plaintext) {
      alert('Please enter plaintext');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/hill/encrypt`, {
        plaintext,
        keyMatrix
      });
      setResult(response.data);
      setCiphertext(response.data.ciphertext);
    } catch (error) {
      alert('Encryption failed: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const handleDecrypt = async () => {
    if (!ciphertext) {
      alert('Please enter ciphertext');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/hill/decrypt`, {
        ciphertext,
        keyMatrix
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
        <h2>Hill Cipher</h2>
        <p>Matrix-based polygraphic substitution cipher</p>
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

      <div className="form-group">
        <label>Matrix Size</label>
        <div className="matrix-size-selector">
          {[2, 3, 4].map(size => (
            <button
              key={size}
              className={matrixSize === size ? 'active' : ''}
              onClick={() => handleMatrixSizeChange(size)}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Key Matrix</label>
        <div className="matrix-input">
          {keyMatrix.map((row, i) => (
            <div key={i} className="matrix-row">
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  value={val}
                  onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                  className="matrix-input-cell"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="form-grid">
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

      {result && result.steps && result.steps.length > 0 && (
        <div className="result-section">
          <h3>Example Calculation (First Block)</h3>
          <div className="steps-display">
            {result.steps.map((step, i) => (
              <div key={i} className="calculation-block">
                <div className="calc-row">
                  <strong>Block:</strong> {step.block}
                </div>
                <div className="calc-row">
                  <strong>Vector:</strong> [{step.vector.join(', ')}]
                </div>
                <div className="calc-row">
                  <strong>Result:</strong> [{(step.encryptedVector || step.decryptedVector).join(', ')}]
                </div>
                <div className="calc-row calc-formula">
                  {step.calculation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Hill;
