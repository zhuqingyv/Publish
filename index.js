/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:54
 * @LastEditTime: 2020-09-01 23:47:11
 * @LastEditors: zhuqingyu
 */
global.PATH = require("./PATH/index.js"); // 通用目录
global._global = require("./global/index.js"); // 全局工具
global.git = require(PATH.GIT);
// 服务启动程序
const server = require("./server/server.js");
const killPort = require(PATH.KILL_PORT);
const ServerJson = require('./server/server.json');
const publish_port = ServerJson.publish.port;

/*
 * 1.清理一下端口
 * 2.开启服务
 */
killPort(publish_port).then(() => {
  server
    .init(publish_port)
    .then(() => {
      console.log(`Server on Port: => ${publish_port}`);
    })
    .catch(() => {
      console.log(`${publish_port} is Error!`);
    });
})

process.on("uncaughtException", function (err) {

  console.log("process捕获到未知错误", {
    err,
    stack: err.stack
  });

});