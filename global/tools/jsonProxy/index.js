/*
 * @Author: zhuqingyu
 * @Date: 2020-09-22 17:38:14
 * @LastEditTime: 2020-09-22 17:38:45
 * @LastEditors: zhuqingyu
 */
const fs = require("fs");

class JsonProxy {

    constructor(_path, code = "utf8") {
        try {
            this.path = _path
            this.data = Object.create(JSON.parse(fs.readFileSync(this.path, code)))
            return this.getProxy(this.data)
        } catch (err) {
            throw err
        }
    }

    getProxy(obj) {
        let root = this.data
        let path = this.path

        for (let key in obj) {
            let attr = obj[key]
            if (typeof attr === 'object') {
                if (attr instanceof Array) {
                    obj[key] = attr.reduce((pre, cur, index) => {
                        pre[index] = this.getProxy(cur)
                        return pre
                    }, [])
                } else if (attr instanceof Object) {
                    obj[key] = this.getProxy(attr)
                }
            }
        }

        if (typeof obj !== 'object') return obj

        return new Proxy(obj, {
            get(target, key) {
                return target[key]
            },
            set(target, key, value) {
                target[key] = value
                const newValue = JSON.stringify(root)
                fs.writeFileSync(path, newValue)
            }
        })
    }
}

module.exports = JsonProxy