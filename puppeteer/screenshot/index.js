/*
 * @Author: zhuqingyu
 * @Date: 2020-08-19 17:29:54
 * @LastEditTime: 2020-08-19 19:58:06
 * @LastEditors: zhuqingyu
 */
module.exports = function (target, path, key) {
    return new Promise(async (resolve, reject) => {
        try {
            target.screenshot({
                path: path
            }).then((e) => {
                console.warn(`${key} 正在截图！`)
                resolve(e)
            })
        } catch (e) {
            reject(e)
        }
    })
}