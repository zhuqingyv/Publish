/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 16:28:33
 * @LastEditTime: 2020-09-04 16:32:08
 * @LastEditors: zhuqingyu
 */
const File = require("./file.js");
const Folder = require("./folder.js");
const Recycle = require("./recycle.js");

class build {
    constructor() {
        this.File = File;
        this.Folder = Folder;
        this.Recycle = Recycle;
    }
}
module.exports = build