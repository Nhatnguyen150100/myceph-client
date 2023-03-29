import crypto from 'crypto-browserify';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const HASH_ALGORITHM = 'md5';

/**
 * todo: Tạo 1 key random 32bit
 * @returns key
 */
export const generateKeyForEncryption = () => {
  const key = crypto.createHash(HASH_ALGORITHM).update(crypto.randomBytes(32)).digest('hex').substring(0, 32);
  return key;
}

/**
 * todo: Tạo 1 iv random 32bit
 * @returns key
 */
export const generateIvForEncryption = () => {
  const iv = crypto.createHash(HASH_ALGORITHM).update(crypto.randomBytes(12)).digest('hex').substring(0, 32);
  return iv;
}


/**
 * todo: tạo 1 cipher để mã hóa dữ liệu
 * @returns 
 */
export const generateCipherForEncryption = (key,iv) =>{
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  return cipher;
}

/**
 * todo: tạo 1 decipher để giải mã dữ liệu
 * @returns 
 */
 export const generateDeCipherForEncryption = (key,iv) =>{
  const deCipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  return deCipher;
}


/**
 * todo: mã hóa dữ liệu sử dụng key và iv
 * @param {*} key 
 * @param {*} iv 
 * @param {*} data 
 * @returns encrypted: dữ liệu sau mã hóa ở dạng hex, tag: dùng trong quá trình giải mã
 */
export const encryptData = (key, iv, data) => {
  const cipher = generateCipherForEncryption(key,iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(data, 'utf-8')),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    encrypted: encrypted.toString('hex'),
    tag: authTag.toString('hex')
  }
}


export const deCryptData = (key,iv,tag,encryptedData) => {
  const decipher = generateDeCipherForEncryption(key,iv);
  decipher.setAuthTag(Buffer.from(tag,'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData,'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf-8');
}