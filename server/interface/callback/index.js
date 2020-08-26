/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 17:56:52
 * @LastEditTime: 2020-08-24 18:29:35
 * @LastEditors: zhuqingyu
 */
const publish = require('./publish/index.js');

const callback = {}
Object.assign(callback, publish)
module.exports = callback