/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 19:40:06
 * @LastEditTime: 2020-08-26 19:52:12
 * @LastEditors: zhuqingyu
 */
const path = require("path")
const jsoner = require("../../../tools/jsoner/index.js");

module.exports = jsoner(path.resolve(__dirname, '../../../../git/publish.json'))