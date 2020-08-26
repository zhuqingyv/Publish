/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 18:59:33
 * @LastEditTime: 2020-08-25 11:15:14
 * @LastEditors: zhuqingyu
 */
// 工具
const setFolder = require('./tools/setFolder/index.js')
const fileReader = require('./tools/fileReader/index.js')
const getPort = require('./tools/getPort/index.js')

// 组件
const publishJson = require('./components/PublishJson/index.js');
const testInterface = require('./components/TestInterface/index.js');
const contentType = require('./components/contentType/index.js');
const getBody = require('./components/getBody/index.js');

module.exports = {
    components: {
        // 公共 json 修改
        publishJson: publishJson(fileReader),
        // 请求是否符合要求
        testInterface,
        // 分配相应的 content-type
        contentType,
        // 获取到请求 body
        getBody
    },
    tools: {
        // 文件读取
        fileReader,
        // 操作到文件夹
        setFolder,
        // 获取可用端口
        getPort
    }
}