/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 18:40:07
 * @LastEditTime: 2020-09-01 10:08:08
 * @LastEditors: zhuqingyu
 */
const fs = require("fs");

const fileReader = {
  test(path, code = "utf8", mode = "r", newValue, callback, context = global) {
    console.log("参数", path, code, mode, newValue, callback, context);
    return {
      getJson: this.getJson(path, code, callback, context),
      setJson: this.setJson(path, newValue, callback, context),
      open: this.open(path, mode, callback, context),
      stat: this.stat(path, callback, context),
    };
  },
  // 阅读
  getJson(path, code = "utf8", callback, context = global) {
    if (callback) {
      fs.readFile(path, code, callback.bind(context));
      return;
    }
    try {
      return fs.readFileSync(path, code);
    } catch (err) {
      return null;
    }
  },
  // 写入
  setJson(path, newValue, callback, context = global) {
    if (callback) {
      return fs.writeFile(path, newValue, callback.bind(context));
    }
    try {
      fs.writeFileSync(path, newValue);
      return newValue;
    } catch (err) {
      return null;
    }
  },
  // 打开
  open(path, mode = "r", callback, context = global) {
    if (callback) {
      fs.open(path, mode, callback.bind(context));
      return;
    }
    try {
      return fs.openSync(path, mode);
    } catch (err) {
      return false
    }
  },
  // 获取文件信息
  stat(path, callback, context = global) {
    if (callback) {
      fs.stat(path, callback.bind(context));
      return;
    }
    try {
      return fs.statSync(path);
    } catch (err) {
      return null
    }
  },
};
module.exports = fileReader;