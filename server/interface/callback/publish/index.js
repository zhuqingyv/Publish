/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:00:14
 * @LastEditTime: 2020-09-07 14:03:54
 * @LastEditors: zhuqingyu
 */

const git = require(PATH.GIT);

const publish = {
  // 发布代码页面UI接口
  "/": require("./rootPage/index.js"),

  // 发布页登陆接口
  "/publish/login": require("./PublishLogin/index.js"),

  // 发布页获取项目列表接口
  "/publish/home/projects": require("./PublishHomeProjects/index.js"),

  // 删除一个已经 clone 好的项目
  "/publish/home/projects/delete": require("./PublishHomeProjectsDelete/index.js"),

  // 新增一个项目 wss, ws, request, socket, socketID, data
  "/publish/home/projects/add": require("./PublishHomeProjectsAdd"),

  // 安装一个项目
  "/publish/home/projects/install": require("./PublishHomeProjectsInstall/index.js"),

  // 打包一个项目
  "/publish/home/projects/build": require("./PublishHomeProjectsBuild/index.js"),
  // 发布一个项目
  "/publish/home/projects/online": require("./PublishHomeProjectsOnline/index.js"),
  // Linux 可视化 桌面
  "/publish/Desktop": require("./desktop/index.js")
};
module.exports = publish;