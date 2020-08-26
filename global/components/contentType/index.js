/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 23:09:26
 * @LastEditTime: 2020-08-26 17:08:44
 * @LastEditors: zhuqingyu
 */
const static = {
    // 代码数据
    '.css': 'text/css',
    '.cssl': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.jsonp': 'application/jsonp',
    '.html': 'text/html',
    '.xml': 'text/xml',
    // 影音资源
    '.png': 'image/png',
    '.jpg': 'image/jpeg ',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mp3',
    '.mp4': 'video/mpeg4'
}
const defaultType = 'text/plain '
const ifMedia = function (type) {
    switch (type) {
        case '.png': {
            return true
        }
        case '.jpg': {
            return true
        }
        case '.ico': {
            return true
        }
        case '.wav': {
            return true
        }
        case '.mp3': {
            return true
        }
        default: {
            return false
        }
    }
}
const contentType = function (url) {
    const type = `.${url.split('.').pop()}`
    // 如果没有扩展名， 默认返回 html文件
    if (url[url.length - 1] === '/') {
        return {
            value: 'text/html',
            format: '.html',
            url: url + 'index.html',
            ifMedia: false
        }
    }
    if (type === '.ico' || type === 'png') debugger
    return {
        get value() {
            return static[type] || defaultType // content-type
        },
        format: type, // 请求资源的扩展名
        url, // 完整地址
        ifMedia: ifMedia(type) // 是否是媒体文件
    }
}
module.exports = contentType