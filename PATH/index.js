/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 22:16:16
 * @LastEditTime: 2020-08-27 16:35:14
 * @LastEditors: zhuqingyu
 */
const path = require("path");

const PATH = {
    PUBLISH_JSON: path.resolve(__dirname, "../git/publish.json"), // 项目目录以及详细信息
    GITHUB_PATH: path.resolve(__dirname, "../git/github"), // github 本地仓库地址
    GIT: path.resolve(__dirname, "../git/index.js"), // git 操作工具
    FILEREADER_PATH: path.resolve(
        __dirname,
        "../global/tools/fileReader/index.js"
    ), // json 读写工具
    CRYPTO_PATH: path.resolve(__dirname, "../global/tools/crypto/index.js"), // 加密模块
    USERDATA_PATH: path.resolve(__dirname, "../store/userData/index.json"), // 用户信息
    PUBLISH_VIEW: path.resolve(__dirname, "../view/dist")
};

module.exports = PATH;