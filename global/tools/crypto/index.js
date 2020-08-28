/*
 * @Author: zhuqingyu
 * @Date: 2020-08-27 10:09:50
 * @LastEditTime: 2020-08-27 10:37:44
 * @LastEditors: zhuqingyu
 */
const crypto = require('crypto')

const Encrypt = (data, key) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

const Decrypt = (encrypted, key) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const Random = (Min, Max) => {
    var Range = Max - Min;
    var Rand = Math.random();
    if (Math.round(Rand * Range) == 0) {
        return Min + 1;
    }
    var num = Min + Math.round(Rand * Range);
    return num;
}

module.exports = {
    // 加密
    Encrypt(str, randomStr) {
        return Encrypt(str, randomStr)
    },

    // 解密
    Decrypt(encrypted, randomStr) {
        return Decrypt(encrypted, randomStr)
    },

    // 生成用户唯一ID
    getPriKey() {
        return Random(1000, 9999)
    }
}