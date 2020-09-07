const testToken = require(PATH.COMPONENTS.TEST_TOKEN);

module.exports = function (
    wss,
    ws,
    request,
    socket,
    socketID,
    data
) {
    // wss: 最外层管理socketServer ws:当前分配的对象
    try {
        const message = JSON.parse(data);
        if (message.heartBeat) return;

        const projectID = message.projectID;
        if (!projectID) throw '没有指定 install 的项目ID'

        const token = message.token;
        if (!token) throw '非法用户'

        const userSocketID = message.socketID;
        if (userSocketID !== socketID) throw "socketID 不正确";

        if (message.heartBeat) return;

        const tokenInfo = testToken(token); // 验证签名
        if (!tokenInfo) throw '非法用户登陆'

        git.install(projectID, (msg) => {
            ws.send(JSON.stringify(msg));
            if (msg.end) {
                ws.close(1000, "安装完成！");
            }
        });
    } catch (err) {
        let reason;
        if (typeof err === "object") {
            reason = JSON.stringify(err);
        } else if (typeof err === "string") {
            reason = err;
        } else {
            reason = "未知错误！";
        }
        ws.close(1007, reason);
    }
}