export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,  // extractable
        ["encrypt", "decrypt"]
    );

    // Public key export (share with server)
    const publicKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const publicKeyB64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));

    // Private key store karo IndexedDB mein (kabhi server pe mat bhejna)
    const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    return { publicKeyB64, keyPair,privateKeyBuffer };
}

export async function loadPrivateKey() {
    const privateKeyB64 = localStorage.getItem("privateKey");
    if (!privateKeyB64) return null;
    const buffer = Uint8Array.from(atob(privateKeyB64), c => c.charCodeAt(0));
    return window.crypto.subtle.importKey(
        "pkcs8", buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false, ["decrypt"]
    );
}

export async function importPublicKey(b64) {
    const buffer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return window.crypto.subtle.importKey(
        "spki", buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false, ["encrypt"]
    );
}