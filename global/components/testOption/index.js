/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 17:04:33
 * @LastEditTime: 2020-08-26 17:25:03
 * @LastEditors: zhuqingyu
 */
module.exports = function (request, response) {
    if (request.method.toLowerCase() == 'options') {
        response.statusCode = 200;
        response.end()
        return true
    }
    return false
}