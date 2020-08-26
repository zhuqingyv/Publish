/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 17:26:57
 * @LastEditTime: 2020-08-26 17:28:46
 * @LastEditors: zhuqingyu
 */
module.exports = function (response, Origin = '*', Cache = 'no-cache', contentType = 'content-type') {
    response.setHeader("Access-Control-Allow-Origin", Origin);
    response.setHeader("Cache-Control", Cache);
    response.setHeader("Access-Control-Allow-Headers", contentType);
}