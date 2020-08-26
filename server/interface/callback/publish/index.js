/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:00:14
 * @LastEditTime: 2020-08-26 13:14:33
 * @LastEditors: zhuqingyu
 */
const path = require("path");
const testInterface = global._global.components.testInterface
const contentType = global._global.components.contentType
const getBody = global._global.components.getBody

const publish = {
  // 发布代码页面UI接口
  "/publish/login/page": function (apiConfig, request, response) {
    try {
      // 测试请求是否符合接口要求
      if (testInterface(apiConfig, request)) {
        const _contentType = contentType(request.url)
        //  资源扩展名
        const format = _contentType.format
        // content-type
        const type = _contentType.value
        //  地址
        const url = _contentType.url
        // 是否是媒体文件
        const ifMedia = _contentType.ifMedia
        // 相对路径替换
        const baseUrl = url.replace('/publish/login/page/', '../../../../view/login/');
        // 资源绝对路径
        const _path = path.resolve(__dirname, baseUrl);

        global._global.tools.fileReader.getJson(_path, ifMedia ? 'binary' : 'utf8', (err, filedata) => {
          let statusCode
          if (err) {
            statusCode = 500
            response.setHeader("Content-Type", 'text/xml');
            response.end();
            return
          }
          response.statusCode = 200;
          response.setHeader("Content-Type", type);
          response.write(filedata, ifMedia ? 'binary' : 'utf8')
          response.end();
        }, this);
      }
    } catch (err) {
      throw err
    }
  },

  // 发布页登陆接口
  "/publish/login": function (_apiConfig, request, response) {
    const apiConfig = _apiConfig
    const responseBody = Object.create(null)
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Access-Control-Allow-Headers", "content-type");

    if (request.method.toLowerCase() == 'options') {
      response.statusCode = 200;
      response.end()
      return
    }
    try {
      getBody(request).then((data, end) => {
        const body = JSON.parse(data[0])
        // const body_arr = body_str.split('&');
        // const body = body_arr.reduce((pre, cur) => {
        //   const cur_arr = cur.split('=')
        //   const key = cur_arr[0]
        //   const value = cur_arr[1]
        //   pre[key] = value
        //   return pre
        // }, Object.create(null))

        for (let key in apiConfig.body) {
          if (apiConfig.body[key] !== body[key]) {
            throw '账号或密码不对'
          }
        }

        responseBody.login = true;
        response.statusCode = 200;
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(responseBody), 'utf8');
      }).catch(err => {
        responseBody.login = false;
        response.statusCode = 200;
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(responseBody), 'utf8');
        console.log(err)
      })
    } catch (err) {
      responseBody.login = false;
      response.statusCode = 200;
      response.setHeader("Access-Control-Allow-Origin", "*")
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(responseBody), 'utf8');
      console.log(err)
    }

  },

  // 发布页接口
  "/publish/home": function () {}, // 发布页主页
};
module.exports = publish;