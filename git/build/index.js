/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:36:51
 * @LastEditTime: 2020-08-30 10:10:53
 * @LastEditors: zhuqingyu
 */
// const exec = require("child_process").exec;
// const fileReader = require(PATH.FILEREADER_PATH);

// module.exports = function (ID) {
//     return new Promise((resolve, reject) => {
//         const project = JSON.parse(fileReader.getJson(`${PATH.PUBLISH_JSON}`))
//             .projects[ID]; // 项目信息
//         const command_build = project.command_build;
//         const command = `cd ./git/github/${ID}/${project.gitName} && npm run ${command_build}`;
//         debugger;
//         exec(command, (error, stdout, stderr) => {
//             if (error) {}
//         });
//     });
// };
const child_process = require("child_process");
const fileReader = require(PATH.FILEREADER_PATH);

module.exports = function (ID, callback) {

  const project = JSON.parse(fileReader.getJson(`${PATH.PUBLISH_JSON}`))
    .projects[ID]; // 项目信息

  // 如果项目不存在
  if (!project) {
    callback({
      info: '项目不存在！',
      end: true
    })
    return
  }

  // 项目 build 命令
  const command_build = project.command_build || 'build'

  const projectPath = `${PATH.GITHUB_PATH}/${ID}/${project.gitName}` // 项目路径

  const running = child_process.spawn('npm', ['run', command_build], {
    cwd: projectPath
  });

  running.stdout.on("data", (data) => {
    if (!data || !callback) return;
    const info = data.toString();
    if (info) {
      callback({
        info,
        type: "log",
        end: false,
      });
    }
  });

  running.stderr.on("data", (data) => {
    if (!data || !callback) return;
    const info = data.toString();
    if (info) {
      callback({
        info,
        type: "warn",
        end: false,
      });
    }
  });

  running.stdout.on('end', () => {
    if (!callback) return;
    callback({
      info: `【${project.gitName}】命令执行结束`,
      type: 'log',
      end: true
    })
  })

};