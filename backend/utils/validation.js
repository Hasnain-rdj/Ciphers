/**
 * Validation Helper Functions
 * Provides comprehensive input validation for cryptography operations
 */

class ValidationHelper {
  /**
   * Validate if a string contains only alphabetic characters
   */
  static isAlphabetic(text) {
    return /^[A-Za-z\s]+$/.test(text);
  }

  /**
   * Validate if a string is valid hexadecimal
   */
  static isHexadecimal(text) {
    return /^[0-9A-Fa-f]+$/.test(text);
  }

  /**
   * Validate if a string contains only numbers
   */
  static isNumeric(text) {
    return /^[0-9\s,.\-]+$/.test(text);
  }

  /**
   * Validate AES key (accepts any text, will be converted to proper format)
   */
  static validateAESKey(key) {
    if (!key || key.trim() === '') {
      return { valid: false, message: 'AES key is required. Please enter an encryption key.' };
    }
    return { valid: true };
  }

  /**
   * Validate DES key (accepts any text, will be converted to proper format)
   */
  static validateDESKey(key) {
    if (!key || key.trim() === '') {
      return { valid: false, message: 'DES key is required. Please enter an encryption key.' };
    }
    return { valid: true };
  }

  /**
   * Validate plaintext for classical ciphers
   */
  static validateClassicalPlaintext(text, cipherName = 'cipher') {
    if (!text || text.trim() === '') {
      return { valid: false, message: `Plaintext is required for ${cipherName}. Please enter the text you want to encrypt.` };
    }
    if (!this.isAlphabetic(text)) {
      return { valid: false, message: `${cipherName} only supports alphabetic characters (A-Z). Please remove numbers and special characters.` };
    }
    return { valid: true };
  }

  /**
   * Validate key for classical ciphers
   */
  static validateClassicalKey(key, cipherName = 'cipher', minLength = 1) {
    if (!key || key.trim() === '') {
      return { valid: false, message: `Key is required for ${cipherName}. Please enter an encryption key.` };
    }
    if (!this.isAlphabetic(key)) {
      return { valid: false, message: `${cipherName} key must contain only alphabetic characters (A-Z).` };
    }
    if (key.length < minLength) {
      return { valid: false, message: `${cipherName} key must be at least ${minLength} character(s) long.` };
    }
    return { valid: true };
  }

  /**
   * Validate Hill cipher matrix
   */
  static validateHillMatrix(matrixText, size) {
    if (!matrixText || matrixText.trim() === '') {
      return { valid: false, message: `Key matrix is required. Please enter ${size}x${size} = ${size*size} numbers separated by commas.` };
    }

    const numbers = matrixText.split(',').map(n => n.trim()).filter(n => n !== '');
    
    if (numbers.length !== size * size) {
      return { valid: false, message: `Hill cipher ${size}x${size} matrix requires exactly ${size*size} numbers. You entered ${numbers.length}.` };
    }

    for (let num of numbers) {
      if (!this.isNumeric(num) || isNaN(parseInt(num))) {
        return { valid: false, message: `Invalid matrix value: "${num}". All matrix entries must be numbers.` };
      }
    }

    return { valid: true };
  }

  /**
   * Check if a number is prime
   */
  static isPrime(n) {
    const num = BigInt(n);
    if (num < 2n) return false;
    if (num === 2n) return true;
    if (num % 2n === 0n) return false;
    
    // Check odd divisors up to sqrt(n)
    const sqrt = BigInt(Math.floor(Math.sqrt(Number(num))));
    for (let i = 3n; i <= sqrt; i += 2n) {
      if (num % i === 0n) return false;
    }
    return true;
  }

  /**
   * Check if g is a primitive root modulo p
   * A primitive root g of p generates all numbers from 1 to p-1 under modular exponentiation
   */
  static isPrimitiveRoot(g, p) {
    const gBig = BigInt(g);
    const pBig = BigInt(p);
    
    if (gBig < 1n || gBig >= pBig) return false;
    
    // For small primes, we can check all values
    // For larger primes, we check if g^((p-1)/q) != 1 for all prime factors q of (p-1)
    const phi = pBig - 1n;
    
    // Get prime factors of phi
    const primeFactors = this.getPrimeFactors(phi);
    
    // Check if g^((p-1)/q) mod p != 1 for each prime factor q
    for (const factor of primeFactors) {
      const exponent = phi / factor;
      if (this.modPow(gBig, exponent, pBig) === 1n) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get prime factors of a number
   */
  static getPrimeFactors(n) {
    const factors = new Set();
    let num = BigInt(n);
    
    // Check for factor 2
    if (num % 2n === 0n) {
      factors.add(2n);
      while (num % 2n === 0n) {
        num = num / 2n;
      }
    }
    
    // Check odd factors
    for (let i = 3n; i * i <= num; i += 2n) {
      if (num % i === 0n) {
        factors.add(i);
        while (num % i === 0n) {
          num = num / i;
        }
      }
    }
    
    // If num > 1, then it's a prime factor
    if (num > 1n) {
      factors.add(num);
    }
    
    return Array.from(factors);
  }

  /**
   * Modular exponentiation: (base^exp) mod mod
   */
  static modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp / 2n;
      base = (base * base) % mod;
    }
    
    return result;
  }

  /**
   * Validate Diffie-Hellman prime number
   */
  static validatePrime(p) {
    if (!p || p.toString().trim() === '') {
      return { valid: false, message: 'Prime number (p) is required for Diffie-Hellman key exchange.' };
    }
    
    const pNum = BigInt(p);
    if (pNum < 2n) {
      return { valid: false, message: 'Prime number (p) must be greater than or equal to 2.' };
    }
    
    // Check if actually prime
    if (!this.isPrime(pNum)) {
      return { valid: false, message: `${p} is not a prime number. Please enter a valid prime number (e.g., 2, 3, 5, 7, 11, 13, 17, 19, 23, etc.)` };
    }
    
    return { valid: true };
  }

  /**
   * Validate Diffie-Hellman generator
   */
  static validateGenerator(g, p) {
    if (!g || g.toString().trim() === '') {
      return { valid: false, message: 'Generator (g) is required for Diffie-Hellman key exchange.' };
    }
    
    const gNum = BigInt(g);
    const pNum = BigInt(p);
    
    if (gNum < 1n || gNum >= pNum) {
      return { valid: false, message: `Generator (g) must be between 1 and ${p-1}.` };
    }
    
    // Check if g is a primitive root of p
    if (!this.isPrimitiveRoot(gNum, pNum)) {
      return { valid: false, message: `${g} is not a primitive root of ${p}. A primitive root must generate all numbers from 1 to ${p-1} under modular exponentiation. Try a different value.` };
    }
    
    return { valid: true };
  }

  /**
   * Validate private key for Diffie-Hellman
   */
  static validatePrivateKey(key, p, name = 'Private key') {
    if (!key || key.toString().trim() === '') {
      return { valid: false, message: `${name} is required for Diffie-Hellman key exchange.` };
    }
    const keyNum = BigInt(key);
    const pNum = BigInt(p);
    if (keyNum < 1n || keyNum >= pNum) {
      return { valid: false, message: `${name} must be between 1 and ${p-1}.` };
    }
    return { valid: true };
  }

  /**
   * Validate file for encryption
   */
  static validateFile(file, maxSizeMB = 50) {
    if (!file) {
      return { valid: false, message: 'Please select a file to encrypt/decrypt.' };
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return { valid: false, message: `File size (${fileSizeMB.toFixed(2)} MB) exceeds the maximum limit of ${maxSizeMB} MB.` };
    }
    return { valid: true };
  }
}

module.exports = ValidationHelper;
