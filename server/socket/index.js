/*
 * @Author: zhuqingyu
 * @Date: 2020-08-28 19:18:11
 * @LastEditTime: 2020-08-30 10:00:02
 * @LastEditors: zhuqingyu
 */
const WebSocket = require('ws');
module.exports = {
    '/publish/home/projects/install': new WebSocket.Server({
        noServer: true
    }),
    '/publish/home/projects/add': new WebSocket.Server({
        noServer: true
    }),
    '/publish/home/projects/build': new WebSocket.Server({
        noServer: true
    })
}