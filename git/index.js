/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:34:49
 * @LastEditTime: 2020-08-28 17:44:44
 * @LastEditors: zhuqingyu
 */
// import command from './command/index.js'
const clone = require('./clone/index.js');
const build = require('./build/index.js');
const install = require('./install/index.js');
module.exports = {
    clone,
    build,
    install
}
// import build from './build/index.js'