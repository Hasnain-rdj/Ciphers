import { useState } from 'react';
import './CipherComponent.css';

function FileEncryption() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [message, setMessage] = useState('');

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProcess = () => {
    if (!file || !key) {
      alert('Select a file and enter a key');
      return;
    }

    // Placeholder: file encryption should be implemented server-side with upload
    setMessage('File encryption is not implemented in this demo. Use API endpoints for text ciphers.');
  };

  return (
    <div className="cipher-container">
      <div className="cipher-header">
        <h2>File Encryption</h2>
        <p>Optional feature: Encrypt and decrypt files (server-side implementation recommended)</p>
      </div>

      <div className="info-banner">
        <span>📁 File encryption feature - Upload files to encrypt/decrypt them using your chosen cipher algorithm.</span>
      </div>

      <div className="form-group">
        <label>File</label>
        <input type="file" onChange={handleFile} />
        {file && <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Selected: {file.name}</small>}
      </div>

      <div className="form-group">
        <label>Key</label>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="Enter encryption key" />
      </div>

      <div className="button-group">
        <button onClick={() => setMode('encrypt')} className={mode === 'encrypt' ? 'active' : ''}>Encrypt</button>
        <button onClick={() => setMode('decrypt')} className={mode === 'decrypt' ? 'active' : ''}>Decrypt</button>
        <button className="secondary" onClick={handleProcess}>Process</button>
      </div>

      {message && (
        <div className="info-box" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)', borderRadius: '8px' }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default FileEncryption;