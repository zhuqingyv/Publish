/*
 * @Author: zhuqingyu
 * @Date: 2020-08-25 11:08:23
 * @LastEditTime: 2020-08-26 13:12:23
 * @LastEditors: zhuqingyu
 * 获取请求体 body（ String ）
 */
const getBody = function (request) {
    const bodyArray = []
    new Promise((resolve, reject) => {
        try {
            request.on('data', chunk => {
                bodyArray.push(chunk.toLocaleString())
                resolve(bodyArray)
            })
        } catch (err) {
            reject(err)
        }

    })
    return new Promise((resolve, reject) => {
        try {
            request.on('end', () => {
                resolve(bodyArray)
            })
        } catch (err) {
            reject(err)
        }
    })
}
module.exports = getBody