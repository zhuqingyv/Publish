/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 17:10:54
 * @LastEditTime: 2020-09-04 17:39:25
 * @LastEditors: zhuqingyu
 */
const getBody = require(PATH.COMPONENTS.GET_BODY); // 获得请求体 body（String）
const testOption = require(PATH.COMPONENTS.TEST_OPTION); // 处理复杂请求第一个试探请求
const allowHeader = require(PATH.COMPONENTS.ALLOW_HEADER); // 处理跨域问题
const testToken = require(PATH.COMPONENTS.TEST_TOKEN);
const fileReader = require(PATH.TOOLS.FILEREADER);
const crypto = require(PATH.TOOLS.CRYPTO); // 加密/解密/生成token 模块

module.exports = function (request, response) {
    const publishJsonPath = PATH.JSON.PUBLISH;
    const userData = JSON.parse(fileReader.getJson(PATH.JSON.USERDATA));

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
                if (userData.userPool[name].passWord !== passWord) throw "用户信息变更";
                if (userData.userPool[name].uuid !== uuid) throw "签名不一致";

                // 管理员和游客可以查看所有的项目
                if (name === "admin" || name === "tourist") {
                    let arr = Object.keys(publishJson.projects).reduce((pre, cur) => {
                        pre.push(publishJson.projects[cur])
                        return pre
                    }, [])
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(
                        JSON.stringify({
                            projects: arr
                        }),
                        "utf8"
                    );
                    return
                }
                userData.userPool[name].projects.forEach((projectID) => {
                    const project = publishJson.projects[projectID];
                    if (project) {
                        const packageJson = fileReader.getJson(
                            `${PATH.GITHUB_PATH}/${projectID}/${project.gitName}/package.json`
                        );
                        project.packageJson = packageJson ? JSON.parse(packageJson) : {};
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
                response.end("服务器出错！", "utf8");
                throw err;
            });
    } catch (err) {
        response.statusCode = 401;
        response.setHeader("Content-Type", "application/json");
        response.end("未知错误", "utf8");
        throw err;
    }
}