import crypto from 'crypto-js'
const REACT_APP_SECURITY_KEY = "Yo+ZufTzlXTqNF1Gxq4qGxCdHk3pHaulF7l13BCD73Y="

/**
 * It takes a string, encrypts it, and returns the encrypted string.
 * @param data - the data to be encrypted
 * @returns The encrypted data.
 */
export function encryptData(data) {
    
    try {
        // the cipher function
        return (crypto.AES.encrypt(data, REACT_APP_SECURITY_KEY)).toString();
    } catch(e) {
        console.log(e);
    }
}

/**
 * It takes a string of encrypted data, decrypts it, and returns the decrypted data.
 * @param data - the data to be decrypted
 * @returns The decrypted data.
 */
export function decryptData(data) {

    try {
        if (data === "false") {
            return data;
        } else {
            // the decipher function
            let bytes = crypto.AES.decrypt(data, REACT_APP_SECURITY_KEY);
            return bytes.toString(crypto.enc.Utf8);
        }
    } catch(e) {
        console.log(e)
    }
}