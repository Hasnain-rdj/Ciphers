class PlayfairCipher {
  constructor(key) {
    this.matrix = this.generateMatrix(key);
  }

  // Generate 5x5 matrix from key
  generateMatrix(key) {
    key = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let seen = new Set();
    let matrix = [];
    let chars = '';

    // Add key characters
    for (let char of key) {
      if (!seen.has(char)) {
        seen.add(char);
        chars += char;
      }
    }

    // Add remaining alphabet (excluding J)
    for (let i = 65; i <= 90; i++) {
      let char = String.fromCharCode(i);
      if (char !== 'J' && !seen.has(char)) {
        seen.add(char);
        chars += char;
      }
    }

    // Create 5x5 matrix
    for (let i = 0; i < 5; i++) {
      matrix[i] = [];
      for (let j = 0; j < 5; j++) {
        matrix[i][j] = chars[i * 5 + j];
      }
    }

    return matrix;
  }

  // Find position of character in matrix
  findPosition(char) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.matrix[i][j] === char) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }

  // Prepare text for encryption (handle repeated letters, odd length)
  prepareText(text) {
    text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let prepared = '';

    for (let i = 0; i < text.length; i++) {
      prepared += text[i];
      if (i < text.length - 1 && text[i] === text[i + 1]) {
        prepared += 'X';
      }
    }

    if (prepared.length % 2 !== 0) {
      prepared += 'X';
    }

    return prepared;
  }

  // Encrypt plaintext
  encrypt(plaintext) {
    const prepared = this.prepareText(plaintext);
    let ciphertext = '';
    let steps = [];

    for (let i = 0; i < prepared.length; i += 2) {
      const char1 = prepared[i];
      const char2 = prepared[i + 1];
      const pos1 = this.findPosition(char1);
      const pos2 = this.findPosition(char2);

      let encrypted1, encrypted2;

      if (pos1.row === pos2.row) {
        // Same row - shift right
        encrypted1 = this.matrix[pos1.row][(pos1.col + 1) % 5];
        encrypted2 = this.matrix[pos2.row][(pos2.col + 1) % 5];
        steps.push(`${char1}${char2} -> Same row -> ${encrypted1}${encrypted2}`);
      } else if (pos1.col === pos2.col) {
        // Same column - shift down
        encrypted1 = this.matrix[(pos1.row + 1) % 5][pos1.col];
        encrypted2 = this.matrix[(pos2.row + 1) % 5][pos2.col];
        steps.push(`${char1}${char2} -> Same column -> ${encrypted1}${encrypted2}`);
      } else {
        // Rectangle - swap columns
        encrypted1 = this.matrix[pos1.row][pos2.col];
        encrypted2 = this.matrix[pos2.row][pos1.col];
        steps.push(`${char1}${char2} -> Rectangle -> ${encrypted1}${encrypted2}`);
      }

      ciphertext += encrypted1 + encrypted2;
    }

    return { ciphertext, steps, matrix: this.matrix };
  }

  // Decrypt ciphertext
  decrypt(ciphertext) {
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    let plaintext = '';
    let steps = [];

    for (let i = 0; i < ciphertext.length; i += 2) {
      const char1 = ciphertext[i];
      const char2 = ciphertext[i + 1];
      const pos1 = this.findPosition(char1);
      const pos2 = this.findPosition(char2);

      let decrypted1, decrypted2;

      if (pos1.row === pos2.row) {
        // Same row - shift left
        decrypted1 = this.matrix[pos1.row][(pos1.col + 4) % 5];
        decrypted2 = this.matrix[pos2.row][(pos2.col + 4) % 5];
        steps.push(`${char1}${char2} -> Same row -> ${decrypted1}${decrypted2}`);
      } else if (pos1.col === pos2.col) {
        // Same column - shift up
        decrypted1 = this.matrix[(pos1.row + 4) % 5][pos1.col];
        decrypted2 = this.matrix[(pos2.row + 4) % 5][pos2.col];
        steps.push(`${char1}${char2} -> Same column -> ${decrypted1}${decrypted2}`);
      } else {
        // Rectangle - swap columns
        decrypted1 = this.matrix[pos1.row][pos2.col];
        decrypted2 = this.matrix[pos2.row][pos1.col];
        steps.push(`${char1}${char2} -> Rectangle -> ${decrypted1}${decrypted2}`);
      }

      plaintext += decrypted1 + decrypted2;
    }

    return { plaintext, steps, matrix: this.matrix };
  }
}

module.exports = PlayfairCipher;
