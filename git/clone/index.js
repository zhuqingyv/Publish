/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:36:56
 * @LastEditTime: 2020-08-31 17:45:17
 * @LastEditors: zhuqingyu
 */
const exec = require("child_process").exec;
const child_process = require("child_process");
const path = require("path");
const initGit = require("./init.js");

module.exports = function (gitHttps, _name, _userToken, callback) {
  const userName = _userToken.name;
  try {
    return initGit(_name).then((id, init_stdout, init_stderr) => {
      debugger
      // 执行git 初始化成功！
      const json = {
        id: id,
        name: _name,
        gitName: path.basename(gitHttps, path.extname(gitHttps)),
        version: "",
        description: "",
      };

      const running = child_process.spawn("git", ["clone", gitHttps], {
        cwd: `${PATH.GITHUB_PATH}/${id}`,
        detached: true,
        shell: true,
        stdio: "pipe",
        windowsHide: true,
      });
      running.stdin.on("data", (data) => {
        console.log("stdin===>>>>>>", data);
      });
      // 正常消息
      running.stdout.on("data", (data) => {
        console.log(data);
        if (!data || !callback) return;
        const cloneInfo = data.toString();
        console.log(cloneInfo);
        if (cloneInfo) {
          callback({
            cloneInfo,
            type: "log",
            end: false,
          });
        }
      });
      // 异常警告
      running.stderr.on("data", (data) => {
        if (!data || !callback) return;
        const cloneInfo = data.toString();
        console.log(cloneInfo);
        if (cloneInfo) {
          callback({
            cloneInfo,
            type: "warn",
            end: false,
          });
        }
      });
      // 克隆结束
      running.stdout.on("end", (error) => {
        if (!callback) return;
        let message = error ?
          error.toString() :
          `【${json.gitName}】安装完毕！`;

        // github 名称
        const baseName = json.gitName;

        // 尝试寻找package.json路径
        const json_path = `${PATH.GITHUB_PATH}/${id}/${baseName}/package.json`;

        // 如果package为空，写入内容
        if (!require(json_path)) {
          // 如果package.json 不存在就创建一个
          global._global.tools.fileReader.open(json_path, "w+");
          global._global.tools.fileReader.setJson(
            json_path,
            JSON.stringify({
              name: json.name,
            })
          );
        }

        // 获取package.json 内容, 并保存在 json 里面
        const packageInfo = JSON.parse(
          global._global.tools.fileReader.getJson(json_path, "utf8")
        );
        json.version = packageInfo.version || "未规定版本"; // 版本
        json.description = packageInfo.description || "没有描述"; // 描述
        json.url = gitHttps;

        // 修改 publishJson
        global._global.components.publishJson.add(json).then((publishJson) => {
          const userData = JSON.parse(
            global._global.tools.fileReader.getJson(PATH.USERDATA_PATH, "utf8")
          );
          const projects = [];
          publishJson = JSON.parse(publishJson);
          userData.userPool[userName].projects.push(json.id);
          global._global.tools.fileReader.setJson(
            PATH.USERDATA_PATH,
            JSON.stringify(userData)
          );
          userData.userPool[userName].projects.forEach((projectID) => {
            projects.push(publishJson.projects[projectID]);
          });
          callback({
            cloneInfo: message,
            type: "log",
            publishJson: JSON.stringify(projects),
            end: true,
          });
        });
      });
    });
  } catch (err) {
    return err;
  }
};