// AES-256 session key banao
export async function generateAESKey() {
  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
  );
}

// Message encrypt karo AES se
export async function encryptMessage(plaintext, aesKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, encoded);
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

// AES key ko member ki public key se encrypt karo
export async function encryptAESKeyForMember(aesKey, memberPublicKey) {
  const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, memberPublicKey, rawKey);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export function bufferToBase64(buffer) {
  return btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  );
}
export function base64ToBuffer(base64) {
  return Uint8Array.from(
    atob(base64),
    c => c.charCodeAt(0)
  ).buffer;
}


// Apni private key se AES key recover karo
export async function decryptAESKey(encryptedKeyB64, privateKey) {
  // console.log("=== decryptAESKey debug ===");
    // console.log("encryptedKeyB64:", encryptedKeyB64);
    // console.log("encryptedKeyB64 type:", typeof encryptedKeyB64);
    // console.log("privateKey:", privateKey);
    // console.log("privateKey type:", privateKey?.type);
    // console.log("privateKey algorithm:", privateKey?.algorithm);
  const buffer = Uint8Array.from(atob(encryptedKeyB64), c => c.charCodeAt(0));
  const rawKey = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, buffer);
  console.log(rawKey);
  
  return window.crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"]);
}

// export async function decryptAESKey(encryptedKeyB64, privateKey) {
//   // ✅ URL-safe Base64 ko standard Base64 mein convert karo
//   const standardB64 = encryptedKeyB64
//     .replace(/-/g, '+')
//     .replace(/_/g, '/');

//   // ✅ Padding fix karo
//   const padded = standardB64.padEnd(
//     standardB64.length + (4 - standardB64.length % 4) % 4, '='
//   );

//   const buffer = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
//   const rawKey = await window.crypto.subtle.decrypt(
//     { name: "RSA-OAEP" },
//     privateKey,
//     buffer
//   );
//   return window.crypto.subtle.importKey(
//     "raw", rawKey,
//     { name: "AES-GCM" },
//     false,
//     ["decrypt"]
//   );
// }

export async function decryptPrivateKey(encryptedPrivateKeyB64, iv64, salt64, password) {
  let encryptedPrivateKey = base64ToBuffer(encryptedPrivateKeyB64)
  let iv = base64ToBuffer(iv64)
  let salt = base64ToBuffer(salt64)
  const aesKey = await deriveKeyFromPassword(password, salt);
  const privateKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(iv)
    },
    aesKey,
    encryptedPrivateKey
  );
  return await window.crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["decrypt"]
  );
}

// Message decrypt karo
export async function decryptMessage(ciphertextB64, ivB64, aesKey) {
  const ciphertext = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
  const plaintext = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ciphertext);
  return new TextDecoder().decode(plaintext);
}


export async function deriveKeyFromPassword(password, salt) {
  // Password ko raw key material mein badlo
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // PBKDF2 se AES key derive karo
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,          // random salt
      iterations: 100000,  // 100k iterations — brute force slow karta hai
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPrivateKey(privateKeyBuffer, password) {
  // Random salt aur IV banao
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Password se AES key derive karo
  const aesKey = await deriveKeyFromPassword(password, salt);

  // Private key encrypt karo
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    privateKeyBuffer
  );
  // Sab saath mein return karo — server ko ye store karna hai
  return {
    encryptedPrivateKey: bufferToBase64(encrypted),
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv)
  };
}
