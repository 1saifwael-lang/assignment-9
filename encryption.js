const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// encrypt using public key
function encryptData(data) {
  return crypto.publicEncrypt(
    publicKey,
    Buffer.from(data)
  );
}

// decrypt using private key
function decryptData(encryptedData) {
  return crypto.privateDecrypt(
    privateKey,
    encryptedData
  );
}

module.exports = { encryptData, decryptData };
