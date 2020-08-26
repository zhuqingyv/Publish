/*
 * @Author: zhuqingyu
 * @Date: 2020-08-17 19:00:11
 * @LastEditTime: 2020-08-18 10:03:46
 * @LastEditors: zhuqingyu
 */
const EventEmitter = require('events')

class Event extends EventEmitter {
    $on(type, callback) {
        console.log('接收', type)
        this.on(type, callback)
    }
    $emit(type, ...arg) {
        console.log('发送', type, ...arg)
        this.emit(type, ...arg)
    }
}

module.exports = new Event()