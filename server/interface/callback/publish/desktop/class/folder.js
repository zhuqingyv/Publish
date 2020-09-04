/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 16:28:52
 * @LastEditTime: 2020-09-04 16:40:32
 * @LastEditors: zhuqingyu
 */
class Folder {
    constructor(name, path, data) {
        this._name = name;
        this._path = path;

        this._x = 0;
        this._y = 0;

        this.initData(data)
    }
    initData(_data) {

    }

    get defaultData() {
        return {
            _x: 0,
            _y: 0
        }
    }
}

module.exports = Folder