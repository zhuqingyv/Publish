/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:46:55
 * @LastEditTime: 2020-08-28 18:21:30
 * @LastEditors: zhuqingyu
 */
const exec = require("child_process").exec;
const uuid = require("node-uuid");

module.exports = function (name) {
  return new Promise((resolve, reject) => {
    // 随机的项目名称
    const uu_name = `${uuid()}_${name}`;
    // 执行初始化的命令
    const command = `cd ${PATH.GITHUB_PATH} && git init ${uu_name}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(
          `执行shell: 【cd ${PATH.GITHUB_PATH} && git init ${uu_name} 出错！】`,
          error
        );
        reject(error);
        return;
      }
      console.log(`执行:【cd ${PATH.GITHUB_PATH} && git init ${uu_name}】成功！`);
      resolve(uu_name, stdout, stderr);
    });
  });
};