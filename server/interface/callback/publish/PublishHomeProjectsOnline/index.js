/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 17:17:04
 * @LastEditTime: 2020-09-04 17:42:54
 * @LastEditors: zhuqingyu
 */
const testToken = require(PATH.COMPONENTS.TEST_TOKEN);
const fileReader = require(PATH.TOOLS.FILEREADER);

module.exports = function (
    wss,
    ws,
    request,
    socket,
    socketID,
    data
) {
    try {
        const message = JSON.parse(data);
        if (message.socketID !== socketID) throw "socketID不正确！";

        const token = message.token;
        if (!token) throw "请登录";

        const tokenInfo = testToken(token);
        if (!tokenInfo) throw "请登录";

        const name = tokenInfo.name; // 用户名

        let userInfo;
        try {
            userInfo = JSON.parse(fileReader.getJson(PATH.JSON.USERDATA)).userPool[
                name
            ]; // 用户信息
            if (!userInfo) throw "用户不存在";
        } catch (err) {
            throw " 用户不存在！";
        }

        const user_projects = userInfo.projects; // 用户上传的项目，也就是可以操作的项目
        const projectID = message.projectID;

        if (!projectID) throw "缺少projectID";

        const project = user_projects.find((pjid) => pjid === projectID);
        if (name !== "admin" && !project) throw "用户没有权限build此项目"; // 检查用户是否有权限操作此项目

        git.buildServer(projectID, (runningMsg) => {
            if (!runningMsg) throw "500";
            try {
                const str = JSON.stringify(runningMsg);
                ws.send(str);
                if (runningMsg.end) {
                    ws.close(1000, "服务开启完成！");
                }
            } catch (err) {
                throw "安装失败";
            }
        });
    } catch (err) {
        if (typeof err === 'object') {
            ws.close(1007, JSON.stringify(err));
        } else if (typeof err === 'string') {
            ws.close(1007, err);
        }
        ws.close(1007, '打包失败')
    }
}