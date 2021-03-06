/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:55:02
 * @LastEditTime: 2020-08-31 14:06:21
 * @LastEditors: zhuqingyu
 */
const fs = require("fs")
const fsExtra = require('fs-extra')
const gotoFolder = require('./gotoFolder.js')

module.exports = {
    gotoFolder,

    // 查找文件夹是否存在, 并返回文件夹内文件信息
    find(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, err => {
                if (err) {
                    reject(false)
                    return
                }
                try {
                    const folderInfo = fs.readdirSync(path)
                    resolve(folderInfo)
                } catch (err) {
                    reject(err)
                }
            })
        })
    },

    // 删除一个文件夹
    delete(path) {
        return new Promise((resolve, reject) => {
            try {
                fsExtra.removeSync(path)
                resolve(true, path)
            } catch (err) {
                reject(err)
            }
        })
    },
    //  新增文件夹
    add(path) {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(path)) {
                    resolve(fs.mkdirSync(path))
                    return
                }
                throw new Error(`路径【${path}】不存在！`)
            } catch (err) {
                reject(err)
            }
        })
    }
}