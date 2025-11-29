import { useState } from 'react';
import axios from 'axios';
import { Users, RefreshCcw, Info } from 'lucide-react';
import './CipherComponent.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function DiffieHellman() {
  const [p, setP] = useState('23');
  const [g, setG] = useState('5');
  const [privateA, setPrivateA] = useState('6');
  const [privateB, setPrivateB] = useState('15');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!p || !g || !privateA || !privateB) {
      alert('Please enter all values');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/dh/generate`, {
        p, g, privateA, privateB
      });
      setResult(response.data);
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const randomize = () => {
    setPrivateA(Math.floor(Math.random() * 10 + 2).toString());
    setPrivateB(Math.floor(Math.random() * 10 + 2).toString());
  };

  return (
    <div className="cipher-container">
      <div className="cipher-header">
        <h2>Diffie-Hellman Key Exchange</h2>
        <p>Compute public keys and shared secret from public parameters</p>
      </div>

      <div className="info-banner">
        <Info size={18} />
        <span>p must be a prime number. g must be a primitive root of p. Private keys must be positive integers less than p.</span>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Prime p</label>
          <input value={p} onChange={e => setP(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Primitive root g</label>
          <input value={g} onChange={e => setG(e.target.value)} />
        </div>
        <div className="form-group">
          <label>A's private key</label>
          <input value={privateA} onChange={e => setPrivateA(e.target.value)} />
        </div>
        <div className="form-group">
          <label>B's private key</label>
          <input value={privateB} onChange={e => setPrivateB(e.target.value)} />
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleGenerate} className="">
          {loading ? 'Computing...' : 'Generate keys'}
        </button>
        <button className="secondary" onClick={randomize}><RefreshCcw size={16} /> Randomize</button>
      </div>

      {result && (
        <div className="result-section">
          <h3>Results</h3>
          <div className="info-box">
            <div><strong>A's Public Key:</strong> {result.alice.publicKey}</div>
            <div><strong>B's Public Key:</strong> {result.bob.publicKey}</div>
            <div><strong>Shared Secret:</strong> {result.sharedSecret}</div>
            <div style={{marginTop: '0.5rem'}}><em>Valid: {result.valid ? 'Yes' : 'No'}</em></div>
          </div>

          <h3>Calculation Steps</h3>
          <div className="steps-display">
            {result.steps.map((s, i) => (
              <div key={i} className="step-item-detailed">
                <div className="step-header">{s.party}</div>
                <div className="step-content">
                  <div className="step-desc">{s.description}</div>
                  <div className="hex-value">{s.calculation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiffieHellman;