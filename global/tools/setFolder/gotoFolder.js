/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 17:01:42
 * @LastEditTime: 2020-08-24 17:01:49
 * @LastEditors: zhuqingyu
 */
const exec = require('child_process').exec;
module.exports = function (path) {
    const command = `cd ${path}`
    return Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return
            }
            // 返回执行结果，输出信息以及绝对路径
            resolve(stdout, stderr, path)
        })
    })
}