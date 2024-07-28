// src/cryptoUtils.js

// Secret Key (16, 24 veya 32 karakter uzunluğunda olmalı)
const SECRET_KEY = 'YourSecretKey123'; // .NET anahtarınız

// Anahtarı Uint8Array'e dönüştür
const key = new TextEncoder().encode(SECRET_KEY);

// IV'nin boyutu
const IV_SIZE = 16; // 16 byte uzunluğunda

export async function encryptString(plainText) {
  // Anahtarları oluştur
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt']
  );

  // IV'yi oluştur
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));

  // Şifreleme işlemi
  const encodedText = new TextEncoder().encode(plainText);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: iv },
    cryptoKey,
    encodedText
  );

  // IV ve şifrelenmiş veriyi birleştir
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const combinedArray = new Uint8Array(IV_SIZE + encryptedArray.length);

  combinedArray.set(iv);
  combinedArray.set(encryptedArray, IV_SIZE);

  // Base64 formatında döndür
  return btoa(String.fromCharCode(...combinedArray));
}

export async function decryptString(encryptedData) {
  // Veriyi Base64 formatından dönüştür
  const data = atob(encryptedData);
  const combinedArray = new Uint8Array([...data].map(c => c.charCodeAt(0)));

  // IV ve şifrelenmiş veriyi ayır
  const iv = combinedArray.slice(0, IV_SIZE);
  const encryptedArray = combinedArray.slice(IV_SIZE);

  // Anahtarları oluştur
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-CBC', length: 256 },
    false,
    ['decrypt']
  );

  // Şifre çözme işlemi
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: iv },
    cryptoKey,
    encryptedArray
  );

  return new TextDecoder().decode(decryptedBuffer);
}
