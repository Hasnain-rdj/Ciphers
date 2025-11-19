const CryptoJS = require('crypto-js');

class DESCipher {
  // DES encryption
  static encrypt(plaintext, key) {
    try {
      // Ensure key is 8 bytes (64 bits)
      let processedKey = key.padEnd(8, '0').substring(0, 8);
      
      // Encrypt using crypto-js
      const encrypted = CryptoJS.DES.encrypt(plaintext, processedKey);
      const ciphertextHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();

      // Convert plaintext to hex
      const plaintextHex = CryptoJS.enc.Utf8.parse(plaintext).toString(CryptoJS.enc.Hex).toUpperCase();
      
      // Convert key to hex
      const keyHex = CryptoJS.enc.Utf8.parse(processedKey).toString(CryptoJS.enc.Hex).toUpperCase();

      const steps = this.generateSteps(plaintextHex, keyHex);

      return {
        ciphertext: ciphertextHex,
        plaintextHex,
        keyHex,
        steps
      };
    } catch (error) {
      throw new Error(`DES Encryption Error: ${error.message}`);
    }
  }

  // DES decryption
  static decrypt(ciphertextHex, key) {
    try {
      // Ensure key is 8 bytes (64 bits)
      let processedKey = key.padEnd(8, '0').substring(0, 8);

      // Convert hex to CryptoJS format
      const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
      });

      // Decrypt
      const decrypted = CryptoJS.DES.decrypt(cipherParams, processedKey);
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

      // Convert to hex
      const plaintextHex = CryptoJS.enc.Utf8.parse(plaintext).toString(CryptoJS.enc.Hex).toUpperCase();
      const keyHex = CryptoJS.enc.Utf8.parse(processedKey).toString(CryptoJS.enc.Hex).toUpperCase();

      return {
        plaintext,
        plaintextHex,
        keyHex
      };
    } catch (error) {
      throw new Error(`DES Decryption Error: ${error.message}`);
    }
  }

  // Generate example steps
  static generateSteps(plaintextHex, keyHex) {
    const steps = [];

    steps.push({
      operation: 'Initial Plaintext',
      data: plaintextHex,
      description: 'Input plaintext in hexadecimal format'
    });

    steps.push({
      operation: 'DES Key (64-bit)',
      data: keyHex,
      description: '64-bit DES encryption key'
    });

    steps.push({
      operation: 'Initial Permutation (IP)',
      description: 'Plaintext is permuted using IP table (64-bit -> 64-bit)',
      note: 'Rearranges bits according to fixed permutation table'
    });

    steps.push({
      operation: '16 Feistel Rounds',
      description: 'Data goes through 16 rounds of Feistel network',
      note: 'Each round uses expansion, S-box substitution, permutation, and XOR with round key'
    });

    steps.push({
      operation: 'Final Permutation (FP)',
      description: 'Inverse of initial permutation applied to get ciphertext',
      note: 'FP is the inverse of IP'
    });

    return steps;
  }
}

module.exports = DESCipher;
