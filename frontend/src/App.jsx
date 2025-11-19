import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, FileText, Database, Users } from 'lucide-react';
import './App.css';
import PlayfairComponent from './components/Playfair';
import HillComponent from './components/Hill';
import VigenereComponent from './components/Vigenere';
import AESComponent from './components/AES';
import DESComponent from './components/DES';
import DiffieHellmanComponent from './components/DiffieHellman';
import FileEncryption from './components/FileEncryption';

function App() {
  const [activeTab, setActiveTab] = useState('playfair');

  const tabs = [
    { id: 'playfair', name: 'Playfair Cipher', icon: Lock, component: PlayfairComponent },
    { id: 'hill', name: 'Hill Cipher', icon: Database, component: HillComponent },
    { id: 'vigenere', name: 'Vigenère Cipher', icon: Key, component: VigenereComponent },
    { id: 'aes', name: 'AES-128', icon: Shield, component: AESComponent },
    { id: 'des', name: 'DES', icon: Lock, component: DESComponent },
    { id: 'dh', name: 'Diffie-Hellman', icon: Users, component: DiffieHellmanComponent },
    { id: 'file', name: 'File Encryption', icon: FileText, component: FileEncryption }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="header"
      >
        <div className="header-content">
          <div className="logo">
            <Shield className="logo-icon" />
            <h1>Cryptography Suite</h1>
          </div>
          <p className="subtitle">Advanced Encryption & Decryption Application</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="tabs"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="tab-icon" />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="active-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="content"
          >
            {ActiveComponent && <ActiveComponent />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="footer"
      >
        <p>Cryptography Application © 2025 | Information Security Project</p>
      </motion.footer>
    </div>
  );
}

export default App;
