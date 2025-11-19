class HillCipher {
  constructor(keyMatrix) {
    this.keyMatrix = keyMatrix;
    this.n = keyMatrix.length;
  }

  // Modular inverse
  modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return 1;
  }

  // Calculate determinant for 2x2 matrix
  determinant2x2(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  // Calculate determinant for 3x3 matrix
  determinant3x3(matrix) {
    return (
      matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
      matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
      matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );
  }

  // Calculate determinant for 4x4 matrix
  determinant4x4(matrix) {
    let det = 0;
    for (let i = 0; i < 4; i++) {
      let minor = this.getMinor(matrix, 0, i);
      det += Math.pow(-1, i) * matrix[0][i] * this.determinant3x3(minor);
    }
    return det;
  }

  // Get minor matrix by removing row and column
  getMinor(matrix, row, col) {
    let minor = [];
    for (let i = 0; i < matrix.length; i++) {
      if (i === row) continue;
      let newRow = [];
      for (let j = 0; j < matrix.length; j++) {
        if (j === col) continue;
        newRow.push(matrix[i][j]);
      }
      minor.push(newRow);
    }
    return minor;
  }

  // Calculate determinant based on matrix size
  determinant(matrix) {
    const n = matrix.length;
    if (n === 2) return this.determinant2x2(matrix);
    if (n === 3) return this.determinant3x3(matrix);
    if (n === 4) return this.determinant4x4(matrix);
    return 0;
  }

  // Calculate cofactor matrix
  cofactorMatrix(matrix) {
    const n = matrix.length;
    let cofactor = [];
    
    for (let i = 0; i < n; i++) {
      cofactor[i] = [];
      for (let j = 0; j < n; j++) {
        let minor = this.getMinor(matrix, i, j);
        let minorDet = n === 2 ? minor[0][0] : 
                       n === 3 ? this.determinant2x2(minor) : 
                       this.determinant3x3(minor);
        cofactor[i][j] = Math.pow(-1, i + j) * minorDet;
      }
    }
    return cofactor;
  }

  // Transpose matrix
  transpose(matrix) {
    const n = matrix.length;
    let transposed = [];
    for (let i = 0; i < n; i++) {
      transposed[i] = [];
      for (let j = 0; j < n; j++) {
        transposed[i][j] = matrix[j][i];
      }
    }
    return transposed;
  }

  // Calculate inverse of key matrix modulo 26
  inverseMatrix(matrix) {
    const det = this.determinant(matrix);
    const detInv = this.modInverse(((det % 26) + 26) % 26, 26);
    
    if (this.n === 2) {
      // For 2x2 matrix
      return [
        [(matrix[1][1] * detInv) % 26, (-matrix[0][1] * detInv) % 26],
        [(-matrix[1][0] * detInv) % 26, (matrix[0][0] * detInv) % 26]
      ].map(row => row.map(val => ((val % 26) + 26) % 26));
    } else {
      // For 3x3 and 4x4 matrices
      const cofactor = this.cofactorMatrix(matrix);
      const adjugate = this.transpose(cofactor);
      
      return adjugate.map(row =>
        row.map(val => ((val * detInv) % 26 + 26) % 26)
      );
    }
  }

  // Prepare text (pad with X if needed)
  prepareText(text) {
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    while (text.length % this.n !== 0) {
      text += 'X';
    }
    return text;
  }

  // Convert text to number vectors
  textToVectors(text) {
    const vectors = [];
    for (let i = 0; i < text.length; i += this.n) {
      const vector = [];
      for (let j = 0; j < this.n; j++) {
        vector.push(text.charCodeAt(i + j) - 65);
      }
      vectors.push(vector);
    }
    return vectors;
  }

  // Multiply matrix and vector
  multiplyMatrixVector(matrix, vector) {
    const result = [];
    for (let i = 0; i < this.n; i++) {
      let sum = 0;
      for (let j = 0; j < this.n; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum % 26);
    }
    return result;
  }

  // Convert vector to text
  vectorToText(vector) {
    return vector.map(num => String.fromCharCode(num + 65)).join('');
  }

  // Encrypt plaintext
  encrypt(plaintext) {
    const prepared = this.prepareText(plaintext);
    const vectors = this.textToVectors(prepared);
    let ciphertext = '';
    let steps = [];

    vectors.forEach((vector, idx) => {
      const encrypted = this.multiplyMatrixVector(this.keyMatrix, vector);
      const encryptedText = this.vectorToText(encrypted);
      ciphertext += encryptedText;
      
      if (idx === 0) {
        steps.push({
          block: this.vectorToText(vector),
          vector: vector,
          encryptedVector: encrypted,
          encryptedBlock: encryptedText,
          calculation: `[${this.keyMatrix.map(row => row.join(',')).join('][')}] × [${vector.join(',')}] = [${encrypted.join(',')}] (mod 26)`
        });
      }
    });

    return { ciphertext, steps, keyMatrix: this.keyMatrix };
  }

  // Decrypt ciphertext
  decrypt(ciphertext) {
    const prepared = this.prepareText(ciphertext);
    const vectors = this.textToVectors(prepared);
    const inverseKey = this.inverseMatrix(this.keyMatrix);
    let plaintext = '';
    let steps = [];

    vectors.forEach((vector, idx) => {
      const decrypted = this.multiplyMatrixVector(inverseKey, vector);
      const decryptedText = this.vectorToText(decrypted);
      plaintext += decryptedText;
      
      if (idx === 0) {
        steps.push({
          block: this.vectorToText(vector),
          vector: vector,
          decryptedVector: decrypted,
          decryptedBlock: decryptedText,
          calculation: `[${inverseKey.map(row => row.join(',')).join('][')}] × [${vector.join(',')}] = [${decrypted.join(',')}] (mod 26)`
        });
      }
    });

    return { plaintext, steps, inverseKeyMatrix: inverseKey };
  }
}

module.exports = HillCipher;
