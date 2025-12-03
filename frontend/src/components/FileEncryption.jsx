import { useState } from 'react';
import { Download, Upload, Lock, Unlock, Copy, Check } from 'lucide-react';
import './CipherComponent.css';

function FileEncryption() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const base64ToArrayBuffer = (base64) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const encryptFile = async () => {
    if (!file || !key) {
      alert('Please select a file and enter an encryption key');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const fileContent = await file.arrayBuffer();
      const base64Content = arrayBufferToBase64(fileContent);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/aes/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plaintext: base64Content,
          key: key
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Encryption failed');
      }

      const data = await response.json();
      
      setResult({
        type: 'encrypted',
        filename: file.name + '.enc',
        ciphertext: data.ciphertext,
        iv: data.iv,
        originalName: file.name
      });
    } catch (error) {
      alert('Encryption failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const decryptFile = async () => {
    if (!file || !key) {
      alert('Please select an encrypted file and enter the key');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const fileContent = await file.text();
      let encryptedData;
      
      try {
        encryptedData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Invalid file format. The selected file is not a valid encrypted file (.enc). Please make sure you selected the correct file that was created by this application.');
      }

      if (!encryptedData.iv || !encryptedData.ciphertext) {
        throw new Error('Missing encryption data. The file must contain both "iv" and "ciphertext" fields. Please encrypt a new file.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/aes/decrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciphertext: encryptedData.ciphertext,
          key: key,
          iv: encryptedData.iv
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Decryption failed - wrong key or corrupted file');
      }

      const data = await response.json();
      const decryptedBuffer = base64ToArrayBuffer(data.plaintext);
      
      setResult({
        type: 'decrypted',
        filename: encryptedData.originalName || 'decrypted_file',
        data: decryptedBuffer,
        size: decryptedBuffer.byteLength
      });
    } catch (error) {
      alert('Decryption failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadEncryptedFile = () => {
    const data = JSON.stringify({
      ciphertext: result.ciphertext,
      iv: result.iv,
      originalName: result.originalName
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDecryptedFile = () => {
    const blob = new Blob([result.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateRandomKey = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const hexKey = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    setKey(hexKey);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cipher-container">
      <div className="cipher-header">
        <h2>File Encryption</h2>
        <p>Encrypt and decrypt any file using AES-128 encryption</p>
      </div>

      <div className="info-banner">
        <span>🔒 Files are encrypted using AES-128 encryption. You can use any text as your encryption key.</span>
      </div>

      <div className="button-group" style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => { setMode('encrypt'); setResult(null); }} 
          className={mode === 'encrypt' ? 'active' : ''}
        >
          <Lock size={18} />
          Encrypt File
        </button>
        <button 
          onClick={() => { setMode('decrypt'); setResult(null); }} 
          className={mode === 'decrypt' ? 'active' : ''}
        >
          <Unlock size={18} />
          Decrypt File
        </button>
      </div>

      <div className="form-group">
        <label>
          {mode === 'encrypt' ? 'Select File to Encrypt' : 'Select Encrypted File (.enc)'}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input 
            type="file" 
            onChange={handleFile}
            accept={mode === 'decrypt' ? '.enc' : '*'}
            style={{ flex: 1 }}
          />
          <Upload size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>
        {file && (
          <small style={{ color: 'rgba(100,255,218,0.8)', marginTop: '0.5rem', display: 'block' }}>
            ✓ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </small>
        )}
      </div>

      <div className="form-group">
        <label>Encryption Key</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            value={key} 
            onChange={e => setKey(e.target.value)} 
            placeholder="Enter your encryption key"
            style={{ flex: 1 }}
          />
          <button 
            onClick={generateRandomKey}
            className="secondary"
            style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
          >
            Generate Key
          </button>
          {key && (
            <button 
              onClick={copyKey}
              className="secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          )}
        </div>
        <small style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', display: 'block' }}>
          Use the same key to decrypt your file later
        </small>
      </div>

      <div className="button-group">
        <button 
          onClick={mode === 'encrypt' ? encryptFile : decryptFile}
          disabled={loading || !file || !key}
          style={{ opacity: loading || !file || !key ? 0.5 : 1 }}
        >
          {loading ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt File' : 'Decrypt File')}
        </button>
      </div>

      {result && (
        <div className="result-box">
          <label>
            {result.type === 'encrypted' ? 'Encryption Successful!' : 'Decryption Successful!'}
          </label>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(100,255,218,0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(100,255,218,0.3)'
          }}>
            <p style={{ marginBottom: '0.5rem', color: 'rgba(100,255,218,1)' }}>
              ✓ {result.type === 'encrypted' ? 'File encrypted' : 'File decrypted'} successfully
            </p>
            <p style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Output: {result.filename}
              {result.size && ` (${(result.size / 1024).toFixed(2)} KB)`}
            </p>
            <button 
              onClick={result.type === 'encrypted' ? downloadEncryptedFile : downloadDecryptedFile}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <Download size={18} />
              Download {result.type === 'encrypted' ? 'Encrypted' : 'Decrypted'} File
            </button>
          </div>
          {result.type === 'encrypted' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(255,193,7,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255,193,7,0.3)'
            }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,193,7,1)', marginBottom: '0.5rem' }}>
                ⚠️ Important: Save your encryption key!
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                You will need this exact key to decrypt the file. Store it securely.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileEncryption;