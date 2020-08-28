/*
 * @Author: zhuqingyu
 * @Date: 2020-08-27 19:06:34
 * @LastEditTime: 2020-08-28 15:38:12
 * @LastEditors: zhuqingyu
 */
const crypto = require(PATH.CRYPTO_PATH);
const fileReader = require(PATH.FILEREADER_PATH);

module.exports = function (token) {
    const userPool = JSON.parse(fileReader.getJson(PATH.USERDATA_PATH)).userPool;
    if (!token) return false
    const publicKey = "1995";
    const tokenInfo = JSON.parse(crypto.Decrypt(token, publicKey));

    const name = tokenInfo.name
    const passWord = tokenInfo.passWord
    const uuid = tokenInfo.uuid

    const realUser = userPool[name]
    if (!tokenInfo) return false
    if (!realUser) return false
    if (!uuid || uuid !== realUser.uuid) return false
    if (!passWord || passWord !== realUser.passWord) return false
    if (realUser.time <= Date.now()) return false

    return tokenInfo
}