/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 22:16:16
 * @LastEditTime: 2020-08-31 16:21:28
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
    PUBLISH_VIEW: path.resolve(__dirname, "../view/dist"),
    SET_FOLDER: path.resolve(__dirname, "../global/tools/setFolder/index.js"), // 查找/删除/新增 文件夹 工具
    KILL_PORT: path.resolve(__dirname, "../global/tools/killPort/index.js"), // 关闭某个端口 工具
    SERVER_JSON: path.resolve(__dirname, "../server/server.json"),
    TOOLS: {
        GET_PORT: path.relative(__dirname, "../global/tools/getPort/index.js")
    }
};

module.exports = PATH;