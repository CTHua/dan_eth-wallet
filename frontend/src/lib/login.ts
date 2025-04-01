function generateSalt(byteLength = 32) {
    // 建立一個指定長度的 Uint8Array
    const salt = new Uint8Array(byteLength);
    // 用安全的隨機數填充
    window.crypto.getRandomValues(salt);
    // 轉換為 Base64 字串
    return arrayBufferToBase64(salt);
}

// 將 ArrayBuffer 轉換成 Base64 字串
function arrayBufferToBase64(buffer: Uint8Array) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToUint8Array(base64: string) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

async function deriveKeyFromPassword(password: string, salt: string) {
    const encoder = new TextEncoder();
    const passwordKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: base64ToUint8Array(salt),              // Uint8Array
            iterations: 100000,      // 根據需求調整次數
            hash: "SHA-256",
        },
        passwordKey,
        { name: "AES-GCM", length: 256 },  // 產生 AES 金鑰
        true,
        ["encrypt", "decrypt"]
    );

    return key;
}


export { generateSalt, deriveKeyFromPassword }
