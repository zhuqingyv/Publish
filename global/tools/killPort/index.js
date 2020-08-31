/*
 * @Author: zhuqingyu
 * @Date: 2020-08-31 14:31:44
 * @LastEditTime: 2020-08-31 15:06:34
 * @LastEditors: zhuqingyu
 */
const exec = require("child_process").exec; //  关闭某个 Port

module.exports = function (port) {
    return new Promise((resolve, reject) => {
        exec(`killport ${port}`, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return
            } else {
                resolve(stdout, stderr)
            }
        })
    })
}