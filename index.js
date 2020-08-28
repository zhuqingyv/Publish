/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:54
 * @LastEditTime: 2020-08-28 15:55:38
 * @LastEditors: zhuqingyu
 */
global.PATH = require("./PATH/index.js"); // 通用目录
global._global = require("./global/index.js"); // 全局工具

// 服务启动程序
const server = require("./server/server.js");

/*
 * 1.获取空闲的端口
 * 2.开启服务
 */
global._global.tools.getPort(8080).then((port) => {
  console.log(`找到空闲端口=======>>>> ${port}`);
  server.init(port).then((e) => {
    console.log(`Active Port: => ${port}`)
  }).catch(err => {
    console.log(`${port} is Error!`)
  })
});