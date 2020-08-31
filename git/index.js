/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:34:49
 * @LastEditTime: 2020-08-31 16:17:06
 * @LastEditors: zhuqingyu
 */
// import command from './command/index.js'
const clone = require('./clone/index.js');
const build = require('./build/index.js');
const install = require('./install/index.js');
const buildServer = require('./buildServer/index.js');
module.exports = {
    clone,
    build,
    install,
    buildServer
}
// import build from './build/index.js'