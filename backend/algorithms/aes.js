const crypto = require('crypto');

class AESCipher {
  // AES-128 encryption (16-byte key)
  static encrypt(plaintext, key) {
    try {
      // Ensure key is 16 bytes (128 bits)
      const keyBuffer = Buffer.from(key, 'utf8');
      const keyHash = crypto.createHash('md5').update(keyBuffer).digest();
      
      // Convert plaintext to buffer
      const plaintextBuffer = Buffer.from(plaintext, 'utf8');
      
      // Pad plaintext to multiple of 16 bytes
      const blockSize = 16;
      const padding = blockSize - (plaintextBuffer.length % blockSize);
      const paddedPlaintext = Buffer.concat([
        plaintextBuffer,
        Buffer.alloc(padding, padding)
      ]);

      // Create cipher
      const iv = Buffer.alloc(16, 0); // Zero IV for simplicity
      const cipher = crypto.createCipheriv('aes-128-cbc', keyHash, iv);
      cipher.setAutoPadding(false);

      // Encrypt
      let encrypted = cipher.update(paddedPlaintext);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      // Generate example step (first round SubBytes simulation)
      const steps = this.generateSteps(paddedPlaintext, keyHash);

      return {
        ciphertext: encrypted.toString('hex').toUpperCase(),
        plaintextHex: paddedPlaintext.toString('hex').toUpperCase(),
        keyHex: keyHash.toString('hex').toUpperCase(),
        iv: iv.toString('hex').toUpperCase(),
        steps
      };
    } catch (error) {
      throw new Error(`AES Encryption Error: ${error.message}`);
    }
  }

  // AES-128 decryption
  static decrypt(ciphertextHex, key, ivHex) {
    try {
      // Ensure key is 16 bytes (128 bits)
      const keyBuffer = Buffer.from(key, 'utf8');
      const keyHash = crypto.createHash('md5').update(keyBuffer).digest();

      // Convert hex ciphertext to buffer
      const ciphertext = Buffer.from(ciphertextHex, 'hex');

      // Use provided IV or default to zero IV
      const iv = ivHex ? Buffer.from(ivHex, 'hex') : Buffer.alloc(16, 0);
      
      // Create decipher
      const decipher = crypto.createDecipheriv('aes-128-cbc', keyHash, iv);
      decipher.setAutoPadding(false);

      // Decrypt
      let decrypted = decipher.update(ciphertext);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      // Remove padding
      const padding = decrypted[decrypted.length - 1];
      const plaintext = decrypted.slice(0, decrypted.length - padding);

      return {
        plaintext: plaintext.toString('utf8'),
        plaintextHex: decrypted.toString('hex').toUpperCase(),
        keyHex: keyHash.toString('hex').toUpperCase()
      };
    } catch (error) {
      throw new Error(`AES Decryption Error: ${error.message}`);
    }
  }

  // Generate example steps (simplified SubBytes example)
  static generateSteps(plaintext, key) {
    const steps = [];
    
    // Show first block
    const firstBlock = plaintext.slice(0, 16);
    const firstBlockHex = firstBlock.toString('hex').toUpperCase();
    
    steps.push({
      operation: 'Initial State (First Block)',
      data: firstBlockHex,
      description: 'First 16-byte block of plaintext'
    });

    // Show key
    steps.push({
      operation: 'AES-128 Key',
      data: key.toString('hex').toUpperCase(),
      description: '128-bit encryption key'
    });

    // Simplified SubBytes example for first 4 bytes
    const subBytesExample = [];
    for (let i = 0; i < Math.min(4, firstBlock.length); i++) {
      const byte = firstBlock[i];
      subBytesExample.push({
        original: byte.toString(16).toUpperCase().padStart(2, '0'),
        position: i
      });
    }

    steps.push({
      operation: 'SubBytes Example (First 4 bytes)',
      data: subBytesExample,
      description: 'S-Box substitution applied to bytes'
    });

    return steps;
  }
}

module.exports = AESCipher;
