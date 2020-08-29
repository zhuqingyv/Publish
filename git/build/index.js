/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:36:51
 * @LastEditTime: 2020-08-29 00:03:55
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

module.exports = function (ID) {

  const project = JSON.parse(fileReader.getJson(`${PATH.PUBLISH_JSON}`))
    .projects[ID]; // 项目信息
  const command_build = project.command_build;
  const command = `cd ./git/github/${ID}/${project.gitName} && npm run ${command_build}`;
  const cp = child_process.spawn(command);
  cp.stdout.on("data", (data) => {
    console.log("child_process =====>", data.toString());
  });
  // return new Promise((resolve, reject) => {
  //     const project = JSON.parse(fileReader.getJson(`${PATH.PUBLISH_JSON}`))
  //         .projects[ID]; // 项目信息
  //     const command_build = project.command_build;
  //     const command = `cd ./git/github/${ID}/${project.gitName} && npm run ${command_build}`;
  //     debugger;
  //     exec(command, (error, stdout, stderr) => {
  //         if (error) {}
  //     });
  // });
};