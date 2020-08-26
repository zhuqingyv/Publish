/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 22:45:09
 * @LastEditTime: 2020-08-26 20:20:32
 * @LastEditors: zhuqingyu
 */

module.exports = function testInterface(option, request) {
    let options = Object.keys(option)
    for (let i = 0; i < options.length; i++) {
        let key = options[i]
        // 检查 Methods
        if (key === 'method') {
            request.method.toLocaleUpperCase() === option.method.toLocaleUpperCase()
        } else if (key === 'body') {
            continue
        } else if (typeof option[key] === 'object') {
            testInterface(option[key], request[key])
        } else if (option[key] !== request[key]) {
            throw new Error(`The key:${key} value is ${request[key]}, it's should be ${option[key]} !`)
        }
    }
    return true
}