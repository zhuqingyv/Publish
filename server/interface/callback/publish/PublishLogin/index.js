const getBody = require(PATH.COMPONENTS.GET_BODY); // 获得请求体 body（String）
const testOption = require(PATH.COMPONENTS.TEST_OPTION); // 处理复杂请求第一个试探请求
const allowHeader = require(PATH.COMPONENTS.ALLOW_HEADER); // 处理跨域问题
const fileReader = require(PATH.TOOLS.FILEREADER);
const crypto = require(PATH.TOOLS.CRYPTO); // 加密/解密/生成token 模块
const outTime = 1000 * 60 * 60; // 60分钟
module.exports = function (request, response) {
    const responseBody = Object.create(null);
    response.setHeader("Content-Type", "application/json");
    allowHeader(response); //  处理跨域问题

    if (testOption(request, response)) return;
    console.log(request.url, request.headers.host)
    try {
        getBody(request)
            .then((data, end) => {
                const userData = JSON.parse(fileReader.getJson(PATH.JSON.USERDATA));
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
                        fileReader.getJson(PATH.JSON.USERDATA)
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
                    fileReader.setJson(PATH.JSON.USERDATA, JSON.stringify(allUserInfo));

                    // 返回数据
                    responseBody.login = true;
                    responseBody.token = token;
                    responseBody.userInfo = userInfo;
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
                }
            })
            .catch((err) => {
                responseBody.login = false;
                response.statusCode = 403;
                response.end(typeof err === "string" ? err : "未知错误！", "utf8");
            });
    } catch (err) {
        responseBody.login = false;
        response.statusCode = 500;
        response.end(typeof err === "string" ? err : "未知错误！", "utf8");
    }
}