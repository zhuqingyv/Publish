/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 15:25:51
 * @LastEditTime: 2020-08-24 17:52:23
 * @LastEditors: zhuqingyu
 */
const net = require("net");

async function portInUse(port) {
  return new Promise((resolve, reject) => {
    let server = net.createServer().listen(port);
    server.on("listening", function() {
      server.close();
      resolve(port);
    });
    server.on("error", function(err) {
      if (err.code == "EADDRINUSE") {
        port++;
        reject(err);
      }
    });
  });
}

const tryUsePort = function(port, _portAvailableCallback) {
  portInUse(port)
    .then((port) => {
      _portAvailableCallback(port);
    })
    .catch((err) => {
      console.log(port + " ====被占用====：\n");
      port++;
      tryUsePort(port, _portAvailableCallback);
    });
};
module.exports = function(_port) {
  return new Promise((resolve, reject) => {
    try {
      tryUsePort(_port, (port) => {
        resolve(port);
      });
    } catch (err) {
      reject(err);
    }
  });
};
