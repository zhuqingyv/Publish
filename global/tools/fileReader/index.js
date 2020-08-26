/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 18:40:07
 * @LastEditTime: 2020-08-24 14:36:04
 * @LastEditors: zhuqingyu
 */
const fs = require('fs')

const fileReader = {
    test(path, code = 'utf8', mode = 'r', newValue, callback, context = global) {
        console.log('参数', path, code, mode, newValue, callback, context)
        return {
            getJson: this.getJson(path, code, callback, context),
            setJson: this.setJson(path, newValue, callback, context),
            open: this.open(path, mode, callback, context),
            stat: this.stat(path, callback, context)
        }
    },
    // 阅读
    getJson(path, code = 'utf8', callback, context = global) {
        if (callback) {
            fs.readFile(path, code, callback.bind(context))
            return
        }
        try {
            return fs.readFileSync(path, code)
        } catch (err) {
            throw err
        }
    },
    // 写入
    setJson(path, newValue, callback, context = global) {
        if (callback) {
            fs.writeFile(path, newValue, callback.bind(context))
            return
        }
        try {
            return fs.writeFileSync(path, newValue)
        } catch (err) {
            throw err
        }
    },
    // 打开
    open(path, mode = 'r', callback, context = global) {
        if (callback) {
            fs.open(path, mode, callback.bind(context))
            return
        }
        try {
            return fs.openSync(path, mode)
        } catch (err) {
            throw err
        }
    },
    // 获取文件信息
    stat(path, callback, context = global) {
        if (callback) {
            fs.stat(path, callback.bind(context))
            return
        }
        try {
            return fs.statSync(path)
        } catch (err) {
            throw err
        }
    }
}
module.exports = fileReader