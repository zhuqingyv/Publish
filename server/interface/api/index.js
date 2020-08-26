/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:16:53
 * @LastEditTime: 2020-08-24 18:40:59
 * @LastEditors: zhuqingyu
 */
const publish = require("./publish/index.js");
const api = {};

Object.assign(api, publish);
module.exports = api;
