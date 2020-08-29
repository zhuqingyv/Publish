/*
 * @Author: zhuqingyu
 * @Date: 2020-08-28 19:18:11
 * @LastEditTime: 2020-08-28 20:44:42
 * @LastEditors: zhuqingyu
 */
const WebSocket = require('ws');
module.exports = {
    '/publish/home/projects/install': new WebSocket.Server({
        noServer: true
    })
}