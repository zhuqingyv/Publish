/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:00:14
 * @LastEditTime: 2020-08-28 16:08:43
 * @LastEditors: zhuqingyu
 */
const path = require("path");
const {
  json
} = require("express");
const contentType = global._global.components.contentType; // 分配contentType
const getBody = global._global.components.getBody; // 获得请求体 body（String）
const testOption = global._global.components.testOption; // 处理复杂请求第一个试探请求
const allowHeader = global._global.components.allowHeader; // 处理跨域问题
const testToken = global._global.components.testToken;

const stringToBuffer = global._global.tools.StringToBuffer; //  字符串 => Buffer
const setFolder = global._global.tools.setFolder; // 删除文件夹

const git = require(PATH.GIT);
const fileReader = require(PATH.FILEREADER_PATH);
const crypto = require(PATH.CRYPTO_PATH); // 加密/解密/生成token 模块
const outTime = 1000 * 60 * 10 // 10分钟

const publish = {
  // 发布代码页面UI接口
  "/": function (request, response) {
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
      // 是否是字体文件
      const ifFont = _contentType.ifFont;
      // 相对路径替换
      const baseUrl = url.replace("/", "../../../../view/dist/");
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
          // if (ifFont) {
          //   response.setHeader("Content-Type", 'text/plain');
          //   response.setHeader("content-length", stringToBuffer(filedata).byteLength);
          //   response.setHeader("accept-ranges", 'bytes');
          //   response.setHeader('Content-Encoding', 'identity');
          //   response.write(filedata, 'binary');
          //   response.end();
          //   return
          // }
          response.write(filedata, ifMedia ? "binary" : "utf8");
          response.end();
        }
      );
    } catch (err) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/xml");
      response.end();
      console.log(err);
    }
  },

  // 发布页登陆接口
  "/publish/login": function (request, response) {
    const responseBody = Object.create(null);
    response.setHeader("Content-Type", "application/json");
    allowHeader(response); //  处理跨域问题

    if (testOption(request, response)) return;

    try {
      getBody(request)
        .then((data, end) => {
          const userData = JSON.parse(fileReader.getJson(PATH.USERDATA_PATH));
          const body = JSON.parse(data[0]);
          const randomStr = "1995";

          if (body.token) {
            // token验证
            const result = JSON.parse(crypto.Decrypt(body.token, randomStr)); // token解码
            const name = result.name; // 用户名
            const passWord = result.passWord; // 密码
            const uuid = result.uuid; // uuid
            const time = result.time; // 过期时间

            if (Date.now() >= time) throw "身份过期";

            if (
              userData.userPool[name] &&
              userData.userPool[name].passWord === passWord
            ) {
              if (uuid !== userData.userPool[name].uuid) throw "签名不一致！";
              responseBody.login = true;
              response.statusCode = 200;
              response.end(JSON.stringify(responseBody), "utf8");
              return;
            }

            throw "签名不一致！";
          } else if (body.name && body.passWord) {
            // 账号密码登陆，同时返回token
            const uuid = body.uuid; // 唯一识别码
            const name = body.name; // 名字
            const passWord = body.passWord; // 密码
            const time = Date.now() + outTime; // 设定身份过期时间

            // 验证请求是否符合要求
            if (!uuid) throw "uuid 不存在！";

            // 提取用户信息
            const allUserInfo = JSON.parse(
              fileReader.getJson(PATH.USERDATA_PATH)
            );
            // 用户信息列表
            const userInfo = allUserInfo.userPool[name]; // 当前用户信息

            // 身份信息验证、参数验证
            if (!userInfo) throw "用户不存在！";
            if (userInfo.passWord !== passWord) throw "账号或密码不对！";
            if (userInfo.uuid && uuid === userInfo.uuid) throw "uuid 重复！";

            // 修改用户 Token 数据
            const _token = {
              name,
              passWord,
              uuid,
              time,
            };
            const token = crypto.Encrypt(JSON.stringify(_token), randomStr); // 生成Token

            // 修改库中用户信息
            userInfo.name = name;
            userInfo.passWord = passWord;
            userInfo.uuid = uuid;
            userInfo.time = time; // 设定过期时间
            fileReader.setJson(PATH.USERDATA_PATH, JSON.stringify(allUserInfo));

            // 返回数据
            responseBody.login = true;
            responseBody.token = token;
            response.statusCode = 200;
            response.end(JSON.stringify(responseBody), "utf8");
          } else {
            responseBody.login = false;
            response.statusCode = 500;
            response.end(
              JSON.stringify({
                body,
                err: "请求体不正确！",
              }),
              "utf8"
            );
            console.warn("请求体不正确！");
          }
        })
        .catch((err) => {
          responseBody.login = false;
          response.statusCode = 403;
          response.end(typeof err === "string" ? err : "未知错误！", "utf8");
          console.log(err);
        });
    } catch (err) {
      responseBody.login = false;
      response.statusCode = 500;
      response.end(typeof err === "string" ? err : "未知错误！", "utf8");
      console.log(err);
    }
  },

  // 发布页获取项目列表接口
  "/publish/home/projects": function (request, response) {
    const publishJsonPath = PATH.PUBLISH_JSON;
    const userData = JSON.parse(fileReader.getJson(PATH.USERDATA_PATH));

    allowHeader(response); // 处理跨域

    if (testOption(request, response)) return; //  处理复杂请求

    try {
      getBody(request)
        .then((data) => {
          const body = JSON.parse(data[0]); // 用户发送过来的数据
          const publishJson = JSON.parse(
            global._global.tools.fileReader.getJson(publishJsonPath)
          ); // 全部的项目数据
          const token = body.token; // token
          if (!testToken(token)) throw "非法登陆";
          const userInfo = JSON.parse(crypto.Decrypt(token, "1995")); // 用户 token信息
          const projects = []; // 给用户返回的列表
          const name = userInfo.name;
          const passWord = userInfo.passWord;
          const uuid = userInfo.uuid;

          if (!userData.userPool[name]) throw "非法用户登陆";
          if (userData.userPool[name].time < Date.now()) throw "身份过期";
          if (userData.userPool[name].passWord !== passWord)
            throw "用户信息变更";
          if (userData.userPool[name].uuid !== uuid) throw "签名不一致";

          userData.userPool[name].projects.forEach((projectID) => {
            const project = publishJson.projects[projectID];
            if (project) {
              const packageJson = fileReader.getJson(`${PATH.GITHUB_PATH}/${projectID}/${project.gitName}/package.json`)
              project.packageJson = packageJson ? JSON.parse(packageJson) : {}
              projects.push(project);
            }
          });

          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(
            JSON.stringify({
              projects,
            }),
            "utf8"
          );
        })
        .catch((err) => {
          response.statusCode = 403;
          response.setHeader("Content-Type", "application/json");
          response.end(err, "utf8");
        });
    } catch (err) {
      response.statusCode = 401;
      response.setHeader("Content-Type", "application/json");
      response.end("未知错误", "utf8");
    }
  },

  // 删除一个已经 clone 好的项目
  "/publish/home/projects/delete": function (request, response) {
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
  "/publish/home/projects/add": function (request, response) {
    allowHeader(response); // 处理跨域

    if (testOption(request, response)) return; // 处理复杂请求

    try {
      getBody(request).then((data) => {
        const body = JSON.parse(data[0]);
        const token = body.token;
        const tokenInfo = testToken(token);
        if (!tokenInfo) throw "非法用户登陆"; // 验证用户登陆信息

        const url = body.url; // github 地址
        const name = body.name; // 名称

        if (!url) throw "地址不存在！";
        if (!name) throw "没有名称";
        git
          .clone(url, name, tokenInfo)
          .then((json) => {
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(json, "utf8");
          })
          .catch((err) => {
            response.statusCode = 403;
            response.setHeader("Content-Type", "application/json");
            response.end(
              typeof err === "string" ? err : JSON.stringify(err),
              "utf8"
            );
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