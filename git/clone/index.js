/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:36:56
 * @LastEditTime: 2020-08-27 01:12:23
 * @LastEditors: zhuqingyu
 */
const exec = require("child_process").exec;
const path = require("path");
const initGit = require("./init.js");

module.exports = function (gitHttps, _name) {
  return new Promise((resolve, reject) => {
    initGit(_name)
      .then((id, init_stdout, init_stderr) => {
        // 执行git 初始化成功！
        const json = {
          id: id,
          name: _name,
          gitName: path.basename(gitHttps, path.extname(gitHttps)),
          version: "",
          description: "",
        };

        const command = `cd ${PATH.GITHUB_PATH}/${id} && git clone ${gitHttps}`;
        console.log(`执行:【${command}】成功！`);
        exec(command, function (error, clone_stdout, clone_stderr) {
          if (error) {
            reject(error);
            return;
          }

          try {
            // github 名称
            const baseName = json.gitName;

            // 尝试寻找package.json路径
            const json_path = path.resolve(
              __dirname,
              `../github/${id}/${baseName}/package.json`
            );

            // 如果package.json 不存在就创建一个
            global._global.tools.fileReader.open(json_path, "a+");

            // 获取package.json 内容, 并保存在 json 里面
            const packageInfo = JSON.parse(
              global._global.tools.fileReader.getJson(json_path, "utf8")
            );
            json.version = packageInfo.version; // 版本
            json.description = packageInfo.description; // 描述
            json.url = gitHttps;
            console.log(`执行:【${command}】成功！`);
            // 修改 publishJson
            global._global.components.publishJson
              .add(json)
              .then((publishJson) => {
                console.log();
                console.log(`同步publishJson成功！`);
                resolve(publishJson, clone_stdout, clone_stderr);
              });
          } catch (err) {
            reject(err);
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
