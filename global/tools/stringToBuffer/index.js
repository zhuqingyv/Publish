/*
 * @Author: zhuqingyu
 * @Date: 2020-08-27 09:56:38
 * @LastEditTime: 2020-08-27 15:05:30
 * @LastEditors: zhuqingyu
 */
module.exports = function (str) {
    const array = []
    for (let i = 0; i < str.length; i++) {
        array.push(str[i].charCodeAt())
    }
    return new Uint8Array(array).buffer
}