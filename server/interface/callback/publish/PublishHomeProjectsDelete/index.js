/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 17:12:14
 * @LastEditTime: 2020-09-04 17:42:47
 * @LastEditors: zhuqingyu
 */
const getBody = require(PATH.COMPONENTS.GET_BODY); // 获得请求体 body（String）
const testOption = require(PATH.COMPONENTS.TEST_OPTION); // 处理复杂请求第一个试探请求
const allowHeader = require(PATH.COMPONENTS.ALLOW_HEADER); // 处理跨域问题
const testToken = require(PATH.COMPONENTS.TEST_TOKEN);
const setFolder = require(PATH.TOOLS.SET_FOLDER); // 删除文件夹
const fileReader = require(PATH.TOOLS.FILEREADER);

module.exports = function (request, response) {
    allowHeader(response); // 处理跨域

    //  处理复杂请求
    if (testOption(request, response)) return;

    try {
        getBody(request).then((data, end) => {
            try {
                const body = JSON.parse(data[0]);
                const projectID = body.projectID;
                if (!projectID) throw 'projectID 为 undefined'

                const hubURL = `${PATH.GITHUB_PATH}/${projectID}`;

                const token = body.token;
                if (!token) throw '非法用户登陆'

                const tokenInfo = testToken(token); // 验证签名
                if (!tokenInfo) throw '非法用户登陆'

                const users = JSON.parse(fileReader.getJson(PATH.JSON.USERDATA))
                const userInfo = users.userPool[tokenInfo.name]
                if (!userInfo) throw '不存在该用户'

                if (userInfo.name !== "admin") {
                    const canDo = userInfo.projects.find(pro => pro === projectID); // 是否可操作当前项目
                    if (!canDo) throw '没有权限操作此项目'
                }


                setFolder.delete(hubURL).then(() => {
                    let json = JSON.parse(fileReader.getJson(PATH.JSON.PUBLISH));
                    delete json.projects[projectID];
                    json = JSON.parse(fileReader.setJson(PATH.JSON.PUBLISH, JSON.stringify(json)));

                    const projectID_index = userInfo.projects.indexOf(projectID)
                    if (projectID_index !== -1) {
                        userInfo.projects.splice(projectID_index, 1)
                    }

                    if (userInfo.name !== "admin") {
                        let arr = []
                        userInfo.projects.forEach(p => {
                            if (json.projects[p]) {
                                arr.push(p)
                            }
                        })
                        json.projects = arr
                    }

                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(json), "utf8");
                }).catch(() => {
                    let json = JSON.parse(fileReader.getJson(PATH.JSON.PUBLISH));
                    delete json.projects[projectID];
                    json = JSON.parse(fileReader.setJson(PATH.JSON.PUBLISH, JSON.stringify(json)));

                    const projectID_index = userInfo.projects.indexOf(projectID)
                    if (projectID_index !== -1) {
                        userInfo.projects.splice(projectID_index, 1)
                    }

                    if (userInfo.name !== "admin") {
                        let arr = []
                        userInfo.projects.forEach(p => {
                            if (json.projects[p]) {
                                arr.push(p)
                            }
                        })
                        json.projects = arr
                    }

                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(json), "utf8");
                })
            } catch (err) {
                response.statusCode = 500;
                response.end('服务器删除出问题', "utf8");
            }
        });
    } catch (err) {
        let errMsg = "服务器错误"
        let code = 500
        if (typeof err === "string") {
            errMsg = err
            code = 403
        } else if (typeof err === "object") {
            errMsg = JSON.stringify(err)
            code = 500
        }
        response.statusCode = code;
        response.setHeader("Content-Type", "application/json");
        response.end(errMsg);
    }
}