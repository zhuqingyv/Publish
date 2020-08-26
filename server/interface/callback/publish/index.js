/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:00:14
 * @LastEditTime: 2020-08-27 01:08:21
 * @LastEditors: zhuqingyu
 */
const path = require("path");
const contentType = global._global.components.contentType; // 分配contentType
const getBody = global._global.components.getBody; // 获得请求体 body（String）
const testOption = global._global.components.testOption; // 处理复杂请求第一个试探请求
const allowHeader = global._global.components.allowHeader; // 处理跨域问题
const jsonManager = global._global.components.jsonManager; // json监听实时处理
const publishJson = global._global.components.publishJson;
const setFolder = global._global.tools.setFolder; // 删除文件夹
const git = require(PATH.GIT);
const fileReader = require(PATH.FILEREADER_PATH);

const publish = {
  // 发布代码页面UI接口
  "/publish/login/page": function (apiConfig, request, response) {
    try {
      const _contentType = contentType(request.url);
      //  资源扩展名
      const format = _contentType.format;
      // content-type
      const type = _contentType.value;
      //  地址
      const url = _contentType.url;
      // 是否是媒体文件
      const ifMedia = _contentType.ifMedia;
      // 相对路径替换
      const baseUrl = url.replace(
        "/publish/login/page/",
        "../../../../view/login/"
      );
      // 资源绝对路径
      const _path = path.resolve(__dirname, baseUrl);

      global._global.tools.fileReader.getJson(
        _path,
        ifMedia ? "binary" : "utf8",
        (err, filedata) => {
          if (err) {
            throw err;
          }
          response.statusCode = 200;
          response.setHeader("Content-Type", type);
          response.write(filedata, ifMedia ? "binary" : "utf8");
          response.end();
        },
        this
      );
    } catch (err) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/xml");
      response.end();
      console.log(err);
    }
  },

  // 发布页登陆接口
  "/publish/login": function (_apiConfig, request, response) {
    const apiConfig = _apiConfig;
    const responseBody = Object.create(null);
    response.setHeader("Content-Type", "application/json");
    allowHeader(response); //  处理跨域问题

    if (testOption(request, response)) return;

    try {
      getBody(request)
        .then((data, end) => {
          const body = JSON.parse(data[0]);

          for (let key in apiConfig.body) {
            if (apiConfig.body[key] !== body[key]) {
              throw "账号或密码不对";
            }
          }

          responseBody.login = true;
          response.statusCode = 200;
          response.end(JSON.stringify(responseBody), "utf8");
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      responseBody.login = false;
      response.statusCode = 500;
      response.end(JSON.stringify(responseBody), "utf8");
      console.log(err);
    }
  },

  // 发布页获取项目列表接口
  "/publish/home/projects": function (_apiConfig, request, response) {
    const publishJsonPath = PATH.PUBLISH_JSON;

    allowHeader(response); // 处理跨域

    //  处理复杂请求
    if (testOption(request, response)) return;

    try {
      getBody(request).then((data, then) => {
        global._global.tools.fileReader.getJson(
          publishJsonPath,
          "utf8",
          (err, filedata) => {
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(filedata, "utf8");
          }
        );
      });
    } catch (err) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end("未知错误", "utf8");
    }
  },

  // 删除一个已经 clone 好的项目
  "/publish/home/projects/delete": function (_apiConfig, request, response) {
    allowHeader(response); // 处理跨域

    //  处理复杂请求
    if (testOption(request, response)) return;

    try {
      getBody(request).then((data, end) => {
        try {
          const body = JSON.parse(data[0]);
          const id = body.id;
          const hubURL = `${PATH.GITHUB_PATH}/${id}`;
          console.log(`删除ID：${id}`);
          setFolder.delete(hubURL).then(() => {
            let json = require(PATH.PUBLISH_JSON);
            delete json.projects[id];
            json = fileReader.setJson(PATH.PUBLISH_JSON, JSON.stringify(json));
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(json, "utf8");
          });
        } catch (err) {
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json");
          response.end();
        }
      });
    } catch (err) {}
  },
  // 新增一个项目
  "/publish/home/projects/add": function (_apiConfig, request, response) {
    allowHeader(response); // 处理跨域

    if (testOption(request, response)) return; // 处理复杂请求

    try {
      getBody(request).then((data) => {
        const body = JSON.parse(data[0]);
        const url = body.url; // github 地址
        const name = body.name; // 名称
        git.clone(url, name).then((json) => {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(json, "utf8");
        });
      });
    } catch (err) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end();
    }
  },
};
module.exports = publish;
