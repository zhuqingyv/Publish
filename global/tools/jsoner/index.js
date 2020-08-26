/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 18:00:11
 * @LastEditTime: 2020-08-26 22:09:57
 * @LastEditors: zhuqingyu
 */
const fs = require("fs");

const update = function (path, newValue) {
    fs.writeFileSync(path, newValue);
    const result = fs.readFileSync(path, 'utf8');
    console.log('删除成功！', result)
    return result
}

const deepProxy = function (_json, _path, callback, root) {
    let json = _json || root;
    let path = _path

    if (typeof json === 'object') {

        for (let key in json) {
            if (typeof json[key] === 'object') {
                json[key] = deepProxy(json[key], path, callback, root);
            }
        }

    }

    return new Proxy(json, {
        get(target, key) {
            return target[key]
        },
        set(target, key, value) {
            target[key] = value
            return callback(path, JSON.stringify(root))
        },
        deleteProperty(target, key) {
            Reflect.deleteProperty(target, key)
            return callback(path, JSON.stringify(root))
        }
    })
}

module.exports = function (path) {
    const root = fs.readFileSync(path, 'utf8');
    return deepProxy(null, path, update, JSON.parse(root));
}