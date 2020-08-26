/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:54
 * @LastEditTime: 2020-08-26 13:52:39
 * @LastEditors: zhuqingyu
 */
// 将全局应用 挂载在全局
global._global = require("./global/index.js");

// 服务启动程序
const server = require("./server/server.js");

// 管理git的插件
const _git = require("./git/index.js");

/*
 * 1.获取空闲的端口
 * 2.开启服务
 */
global._global.tools.getPort(80).then((port) => {
  server.init(port).then(e => {
    _git.clone("https://github.com/zhuqingyv/canvasGo.git", "canvas_Go").then((json, publishJson) => {
      console.log(json, publishJson);
    })
  });
});
// _git
//   .clone("https://github.com/zhuqingyv/canvasGo.git", "canvas_Go")
//   .then((json, publishJson) => {
//     // console.log(json, publishJson);
//     console.log("成功！");
//   })
//   .catch((e) => {
//     console.log(e);
//   });
// const server = require("./server/server.js")
// const exec = require('child_process').exec;
// const command = 'git branch -al';

// setTimeout(() => {
//     exec(command, function (error, stdout, stderr) {
//         if (error) {
//             console.error(error)
//             return
//         }
//         console.log('stdout', stdout);
//         console.log('stderr', stderr)
//     });
// }, 1000)
// const fileReader = require("./fileReader/index.js")
// const path = require("path")
// const Event = require("./event/index.js")
// path, code = 'utf8', mode = 'r', callback, context = global
// const obj = {
//     name: "朱庆宇1996",
//     age: 25
// }
// 开启文件读写系统
// server.init(3000, () => {
//     let _path = path.resolve(__dirname, './abc.json')
//     Event.$emit('fileTest', _path, 'utf8', 'r', JSON.stringify(obj))
// })
// server.init(3000, () => {
//     console.log('开启成功！')
// })

// 开始截图系统
// const test = require("./puppeteer/index.js");
// test()