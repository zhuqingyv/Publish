/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:54
 * @LastEditTime: 2020-08-29 21:12:23
 * @LastEditors: zhuqingyu
 */
global.PATH = require("./PATH/index.js"); // 通用目录
global._global = require("./global/index.js"); // 全局工具
global.git = require(PATH.GIT);
// 服务启动程序
const server = require("./server/server.js");

/*
 * 1.获取空闲的端口
 * 2.开启服务
 */
global._global.tools.getPort(80).then((port) => {
  console.log(`找到空闲端口=======>>>> ${port}`);
  server
    .init(port)
    .then((e) => {
      console.log(`Active Port: => ${port}`);
    })
    .catch((err) => {
      console.log(`${port} is Error!`);
    });
});

process.on("uncaughtException", function (err) {
  console.log("process捕获到未知错误", err, err.stack);
  //打印出错误
  // console.log(err);
  //打印出错误的调用栈方便调试
  // console.log(err.stack);
});