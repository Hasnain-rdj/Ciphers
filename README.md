# 🔐 Cryptography Application

A modern cryptography application implementing classical and modern encryption algorithms with a futuristic UI. Available as both a **web application** and **desktop application** (Windows, macOS, Linux). Built with React.js, Node.js, and Electron.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop-brightgreen)

## 🌐 Live Demo

- **Live Website**: [https://isciphers.netlify.app](https://isciphers.netlify.app)
- **Backend API**: [https://ciphers-1be6.onrender.com](https://ciphers-1be6.onrender.com)
- **Desktop App**: Available for Windows, macOS, and Linux

## ✨ Features

### Classical Ciphers
- **Playfair Cipher**: 5×5 matrix-based substitution cipher
- **Hill Cipher**: Matrix-based polygraphic substitution (supports 2×2, 3×3, 4×4 matrices)
- **Vigenère Cipher**: Polyalphabetic substitution using keyword encryption

### Modern Encryption
- **AES-128**: Advanced Encryption Standard with 128-bit keys (CBC mode)
- **DES**: Data Encryption Standard with hex input/output
- **File Encryption**: Encrypt/decrypt any file using AES-128 (up to 50MB)

### Key Exchange
- **Diffie-Hellman**: Secure key exchange protocol with step-by-step visualization

### UI/UX Features
- ✨ Futuristic glass-morphism design
- 🎨 Smooth animations and transitions
- 📋 One-click copy to clipboard
- 🔄 Real-time encryption/decryption
- 📱 Responsive design
- 🌈 Gradient backgrounds with animated effects
- 💻 Cross-platform desktop application

## 🛠️ Technology Stack

### Frontend
- React 19.2.0
- Vite (Build tool)
- Framer Motion (Animations)
- Lucide React (Icons)
- Axios (HTTP client)
- Electron 39.2.4 (Desktop app)

### Backend
- Node.js
- Express.js 5.1.0
- crypto (Built-in Node.js module for AES)
- crypto-js 4.2.0 (DES implementation)
- CORS 2.8.5
- body-parser (50MB payload limit)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

#### 1. Clone the repository
```bash
git clone https://github.com/Hasnain-rdj/Ciphers.git
cd Ciphers
```

#### 2. Setup Backend
```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`

#### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## 💻 Desktop Application

### Build Desktop App for Windows

The desktop application is **completely standalone** - it includes both the frontend and backend server, so you don't need to run any separate servers!

#### Step 1: Navigate to frontend directory
```powershell
cd frontend
```

#### Step 2: Build the desktop application
```powershell
npm run package:win
```

This will:
- Build the React frontend
- Copy the backend server and install its dependencies
- Package everything into a standalone executable

#### Step 3: Find your application
The packaged app will be in: `frontend/release/CryptographyApp-win32-x64/`

#### Step 4: Run the application
Double-click `CryptographyApp.exe` to launch

The application will automatically:
1. Start the backend server on `http://localhost:5000`
2. Launch the frontend UI
3. Connect them together seamlessly

### Desktop App Features
- ✅ **Fully standalone** - No separate backend server needed!
- ✅ **Backend included** - Server starts automatically when you launch the app
- ✅ **No installation required** (portable)
- ✅ **Works offline** - All encryption happens locally
- ✅ All encryption features included
- ✅ Futuristic UI with animations
- ✅ File size: ~200-250 MB (includes Chromium runtime + Node.js backend)

### Build for Other Platforms

**macOS:**
```bash
npm run package:mac
```

**Linux:**
```bash
npm run package:linux
```

### Development Mode (Desktop)
Run the desktop app in development mode with hot reload:
```powershell
npm run electron:dev
```

Note: In development mode, make sure the backend server is running separately on port 5000.

## 📦 Deployment

### Backend (Render.com)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variable: `PORT` (Render sets this automatically)

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Configure build settings (or use `netlify.toml`):
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL` = `https://ciphers-1be6.onrender.com/api`

## 📡 API Endpoints

### Classical Ciphers
- `POST /api/playfair/encrypt` - Encrypt with Playfair cipher
- `POST /api/playfair/decrypt` - Decrypt with Playfair cipher
- `POST /api/hill/encrypt` - Encrypt with Hill cipher
- `POST /api/hill/decrypt` - Decrypt with Hill cipher
- `POST /api/vigenere/encrypt` - Encrypt with Vigenère cipher
- `POST /api/vigenere/decrypt` - Decrypt with Vigenère cipher

### Modern Encryption
- `POST /api/aes/encrypt` - Encrypt with AES-128
- `POST /api/aes/decrypt` - Decrypt with AES-128
- `POST /api/des/encrypt` - Encrypt with DES
- `POST /api/des/decrypt` - Decrypt with DES

### Key Exchange
- `POST /api/dh/generate` - Generate Diffie-Hellman keys and shared secret

### Health Check
- `GET /api/health` - Check API status

## 🎯 Usage Examples

### Playfair Cipher
```javascript
// Request
POST /api/playfair/encrypt
{
  "plaintext": "HELLO WORLD",
  "key": "MONARCHY"
}

// Response
{
  "ciphertext": "GATLMZCLRQTX"
}
```

### AES-128
```javascript
// Request
POST /api/aes/encrypt
{
  "plaintext": "Secret Message",
  "key": "0123456789abcdef0123456789abcdef"
}

// Response
{
  "ciphertext": "a1b2c3d4e5f6...",
  "iv": "1a2b3c4d5e6f..."
}
```

### File Encryption
The File Encryption feature allows you to encrypt any file (images, documents, videos) up to 50MB:

1. **Encrypt**: Upload a file, generate or enter a 32-character hex key, and download the encrypted `.enc` file
2. **Decrypt**: Upload the `.enc` file with the same key to recover the original file
3. **Security**: Each encryption uses a unique IV (Initialization Vector) for added security

## 📂 Project Structure

```
Ciphers/
├── backend/
│   ├── algorithms/
│   │   ├── playfair.js
│   │   ├── hill.js
│   │   ├── vigenere.js
│   │   ├── aes.js
│   │   ├── des.js
│   │   └── diffieHellman.js
│   ├── routes/
│   │   ├── playfair.js
│   │   ├── hill.js
│   │   ├── vigenere.js
│   │   ├── aes.js
│   │   ├── des.js
│   │   └── diffieHellman.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── electron/
│   │   ├── main.cjs         # Electron main process
│   │   └── preload.cjs      # Preload script
│   ├── src/
│   │   ├── components/
│   │   │   ├── Playfair.jsx
│   │   │   ├── Hill.jsx
│   │   │   ├── Vigenere.jsx
│   │   │   ├── AES.jsx
│   │   │   ├── DES.jsx
│   │   │   ├── DiffieHellman.jsx
│   │   │   ├── FileEncryption.jsx
│   │   │   └── CipherComponent.css
│   │   │   ├── Hill.jsx
│   │   │   ├── Vigenere.jsx
│   │   │   ├── AES.jsx
│   │   │   ├── DES.jsx
│   │   │   ├── DiffieHellman.jsx
│   │   │   ├── FileEncryption.jsx
│   │   │   └── CipherComponent.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── netlify.toml
└── README.md
```

## 🔒 Security Notes

- This application is for **educational purposes** only
- Classical ciphers (Playfair, Hill, Vigenère) are **not secure** for modern use
- DES is considered **deprecated** and should not be used for sensitive data
- For production applications, use modern encryption standards (AES-256, ChaCha20)
- Never hardcode encryption keys in production
- Always use HTTPS in production environments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Hasnain-rdj**
- GitHub: [@Hasnain-rdj](https://github.com/Hasnain-rdj)

## 🙏 Acknowledgments

- Built with React and Node.js
- UI inspired by modern glass-morphism design trends
- Cryptography algorithms based on standard implementations

---

⭐ If you find this project useful, please consider giving it a star!
