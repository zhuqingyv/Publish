/*
 * @Author: zhuqingyu
 * @Date: 2020-08-27 19:06:34
 * @LastEditTime: 2020-09-04 16:59:22
 * @LastEditors: zhuqingyu
 */
const crypto = require(PATH.TOOLS.CRYPTO);
const fileReader = require(PATH.TOOLS.FILEREADER);

module.exports = function (token) {
    const userPool = JSON.parse(fileReader.getJson(PATH.JSON.USERDATA)).userPool;
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