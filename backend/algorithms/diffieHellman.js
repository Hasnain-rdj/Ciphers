class DiffieHellman {
  // Modular exponentiation (base^exp mod mod)
  static modPow(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);

    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp / 2n;
      base = (base * base) % mod;
    }

    return result.toString();
  }

  // Generate public keys and shared secret
  static generateKeys(p, g, privateA, privateB) {
    try {
      // Validate inputs
      p = BigInt(p);
      g = BigInt(g);
      privateA = BigInt(privateA);
      privateB = BigInt(privateB);

      // Calculate public keys
      // A's public key: g^a mod p
      const publicA = this.modPow(g, privateA, p);
      
      // B's public key: g^b mod p
      const publicB = this.modPow(g, privateB, p);

      // Calculate shared secrets
      // A computes: (publicB)^privateA mod p
      const sharedSecretA = this.modPow(publicB, privateA, p);
      
      // B computes: (publicA)^privateB mod p
      const sharedSecretB = this.modPow(publicA, privateB, p);

      // Generate calculation steps
      const steps = [
        {
          party: 'Setup',
          calculation: `Prime p = ${p.toString()}`,
          description: 'Publicly shared prime number'
        },
        {
          party: 'Setup',
          calculation: `Primitive root g = ${g.toString()}`,
          description: 'Publicly shared primitive root modulo p'
        },
        {
          party: 'Alice',
          calculation: `Private key a = ${privateA.toString()}`,
          description: 'Alice\'s private key (kept secret)'
        },
        {
          party: 'Alice',
          calculation: `Public key A = g^a mod p = ${g}^${privateA} mod ${p} = ${publicA}`,
          description: 'Alice computes and shares public key A'
        },
        {
          party: 'Bob',
          calculation: `Private key b = ${privateB.toString()}`,
          description: 'Bob\'s private key (kept secret)'
        },
        {
          party: 'Bob',
          calculation: `Public key B = g^b mod p = ${g}^${privateB} mod ${p} = ${publicB}`,
          description: 'Bob computes and shares public key B'
        },
        {
          party: 'Alice',
          calculation: `Shared secret = B^a mod p = ${publicB}^${privateA} mod ${p} = ${sharedSecretA}`,
          description: 'Alice computes shared secret using Bob\'s public key'
        },
        {
          party: 'Bob',
          calculation: `Shared secret = A^b mod p = ${publicA}^${privateB} mod ${p} = ${sharedSecretB}`,
          description: 'Bob computes shared secret using Alice\'s public key'
        },
        {
          party: 'Result',
          calculation: `Both parties now share the secret: K = ${sharedSecretA}`,
          description: 'Shared secret established securely without transmitting it'
        }
      ];

      return {
        publicParameters: {
          p: p.toString(),
          g: g.toString()
        },
        alice: {
          privateKey: privateA.toString(),
          publicKey: publicA,
          sharedSecret: sharedSecretA
        },
        bob: {
          privateKey: privateB.toString(),
          publicKey: publicB,
          sharedSecret: sharedSecretB
        },
        sharedSecret: sharedSecretA,
        steps,
        valid: sharedSecretA === sharedSecretB
      };
    } catch (error) {
      throw new Error(`Diffie-Hellman Error: ${error.message}`);
    }
  }
}

module.exports = DiffieHellman;
