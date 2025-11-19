class VigenereCipher {
  constructor(key) {
    this.key = key.toUpperCase().replace(/[^A-Z]/g, '');
  }

  // Generate repeating key to match text length
  generateKey(text) {
    let repeatedKey = '';
    for (let i = 0; i < text.length; i++) {
      repeatedKey += this.key[i % this.key.length];
    }
    return repeatedKey;
  }

  // Encrypt plaintext
  encrypt(plaintext) {
    const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const repeatedKey = this.generateKey(cleanText);
    let ciphertext = '';
    let steps = [];

    for (let i = 0; i < cleanText.length; i++) {
      const plainChar = cleanText[i];
      const keyChar = repeatedKey[i];
      const plainNum = plainChar.charCodeAt(0) - 65;
      const keyNum = keyChar.charCodeAt(0) - 65;
      const cipherNum = (plainNum + keyNum) % 26;
      const cipherChar = String.fromCharCode(cipherNum + 65);
      
      ciphertext += cipherChar;
      
      if (i < 3) {
        steps.push({
          position: i,
          plainChar,
          keyChar,
          plainValue: plainNum,
          keyValue: keyNum,
          calculation: `(${plainNum} + ${keyNum}) mod 26 = ${cipherNum}`,
          cipherChar
        });
      }
    }

    return { ciphertext, steps, key: this.key, repeatedKey };
  }

  // Decrypt ciphertext
  decrypt(ciphertext) {
    const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    const repeatedKey = this.generateKey(cleanText);
    let plaintext = '';
    let steps = [];

    for (let i = 0; i < cleanText.length; i++) {
      const cipherChar = cleanText[i];
      const keyChar = repeatedKey[i];
      const cipherNum = cipherChar.charCodeAt(0) - 65;
      const keyNum = keyChar.charCodeAt(0) - 65;
      const plainNum = ((cipherNum - keyNum) % 26 + 26) % 26;
      const plainChar = String.fromCharCode(plainNum + 65);
      
      plaintext += plainChar;
      
      if (i < 3) {
        steps.push({
          position: i,
          cipherChar,
          keyChar,
          cipherValue: cipherNum,
          keyValue: keyNum,
          calculation: `(${cipherNum} - ${keyNum}) mod 26 = ${plainNum}`,
          plainChar
        });
      }
    }

    return { plaintext, steps, key: this.key, repeatedKey };
  }
}

module.exports = VigenereCipher;
