const crypto = require("crypto");
const algorithm = "aes-256-cbc"

const encryptData = (data) => {
    const cipher = crypto.createCipheriv(algorithm, process.env.SECURITY_KEY, process.env.INIT_VECTOR);
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData
}

const decryptData = (data) => {
    const decipher = crypto.createDecipheriv(algorithm, process.env.SECURITY_KEY, process.env.INIT_VECTOR);
    let decryptedData = decipher.update(data, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData
}

module.exports = {encryptData, decryptData}