/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 22:16:16
 * @LastEditTime: 2020-08-27 00:54:17
 * @LastEditors: zhuqingyu
 */
const path = require("path");

const PATH = {
  PUBLISH_JSON: path.resolve(__dirname, "../git/publish.json"),
  GITHUB_PATH: path.resolve(__dirname, "../git/github"),
  GIT: path.resolve(__dirname, "../git/index.js"),
  FILEREADER_PATH: path.resolve(
    __dirname,
    "../global/tools/fileReader/index.js"
  ),
};

module.exports = PATH;
