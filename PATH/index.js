/*
 * @Author: zhuqingyu
 * @Date: 2020-08-26 22:16:16
 * @LastEditTime: 2020-09-22 11:20:48
 * @LastEditors: zhuqingyu
 */
const path = require("path");

const PATH = {
    TOOLS: {
        FILEREADER: path.resolve(__dirname, "../global/tools/fileReader/index.js"), // json 读写工具
        GET_PORT: path.resolve(__dirname, "../global/tools/getPort/index.js"),
        CRYPTO: path.resolve(__dirname, "../global/tools/crypto/index.js"), // 加密模块
        KILL_PORT: path.resolve(__dirname, "../global/tools/killPort/index.js"), // 关闭某个端口 工具
        SET_FOLDER: path.resolve(__dirname, "../global/tools/setFolder/index.js"), // 查找/删除/新增 文件夹 工具
        STRING_TO_BUFFER: path.resolve(__dirname, "../global/tools/stringToBuffer/index.js")
    },
    COMPONENTS: {
        GET_BODY: path.resolve(__dirname, "../global/components/getBody/index.js"), // 获取 request 的body
        TEST_AUTHORIZATION: path.resolve(__dirname, "../global/components/testAuthorization/index.js"), // 检查 用户信息
        TEST_OPTION: path.resolve(__dirname, "../global/components/testOption/index.js"), // 处理前端复杂请求
        TEST_TOKEN: path.resolve(__dirname, "../global/components/testToken/index.js"), // 检查 token
        CONTENT_TYPE: path.resolve(__dirname, "../global/components/contentType/index.js"), // content-type 字典
        ALLOW_HEADER: path.resolve(__dirname, "../global/components/allowHeader/index.js") // 跨域临时 CORS 处理
    },
    JSON: {
        SERVER: path.resolve(__dirname, "../server/server.json"),
        USERDATA: path.resolve(__dirname, "../store/userData/index.json"), // 用户信息
        PUBLISH: path.resolve(__dirname, "../git/publish.json"), // 项目目录以及详细信息
    },
    STATIC: {
        PUBLISH: path.resolve(__dirname, '../../Publish-View/dist')
    },

    GITHUB_PATH: path.resolve(__dirname, "../git/github"), // github 本地仓库地址
    GIT: path.resolve(__dirname, "../git/index.js"), // git 操作工具
    PUBLISH_VIEW: path.resolve(__dirname, "../view/dist"), // 默认首页
};

module.exports = PATH;