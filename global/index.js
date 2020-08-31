/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:59:33
 * @LastEditTime: 2020-08-31 15:07:14
 * @LastEditors: zhuqingyu
 */
// 工具
const setFolder = require('./tools/setFolder/index.js');
const fileReader = require('./tools/fileReader/index.js');
const getPort = require('./tools/getPort/index.js');
const StringToBuffer = require('./tools/stringToBuffer/index.js');
const crypto = require('./tools/crypto/index.js');
const killPort = require('./tools/killPort/index.js');

// 组件
const publishJson = require('./components/PublishJson/index.js');
const testInterface = require('./components/TestInterface/index.js');
const contentType = require('./components/contentType/index.js');
const getBody = require('./components/getBody/index.js');
const testOption = require('./components/testOption/index.js');
const allowHeader = require('./components/allowHeader/index.js');
const jsonManager = require('./components/jsonManager/index.js');
const testToken = require('./components/testToken/index.js');

module.exports = {
    components: {
        // 公共 json 修改
        publishJson: publishJson(fileReader),
        // 请求是否符合要求
        testInterface,
        // 分配相应的 content-type
        contentType,
        // 获取到请求 body
        getBody,
        // 处理复杂请求直接返回
        testOption,
        // 设置 跨域等
        allowHeader,
        // json管理
        jsonManager,
        // 测试 token 是否合法
        testToken
    },
    tools: {
        // 文件读取
        fileReader,
        // 操作到文件夹
        setFolder,
        // 获取可用端口
        getPort,
        // 字符串转 Buffer
        StringToBuffer,
        // 加密模块
        crypto,
        // 关闭某个端口
        killPort
    }
}