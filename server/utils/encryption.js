import CryptoJS from "crypto-js";

export const encrypt = (text) =>
  CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();

export const decrypt = (cipher) =>
  CryptoJS.AES.decrypt(cipher, process.env.ENCRYPTION_KEY).toString(
    CryptoJS.enc.Utf8
  );
