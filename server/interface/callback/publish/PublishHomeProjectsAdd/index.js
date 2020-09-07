/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 17:13:31
 * @LastEditTime: 2020-09-04 17:39:51
 * @LastEditors: zhuqingyu
 */
const testToken = require(PATH.COMPONENTS.TEST_TOKEN);
module.exports = function (
    wss,
    ws,
    request,
    socket,
    socketID,
    data
) {
    try {
        if (data.heartBeat) return;
        const message = JSON.parse(data);

        const token = message.token;
        if (!token) throw "非法用户登陆";

        const tokenInfo = testToken(token); // 验证签名
        if (!tokenInfo) throw "非法用户登陆";

        if (message.socketID !== socketID) throw "socketID不对！";


        const url = message.url; // github 地址
        if (!url) throw "地址不存在！";

        const name = message.name; // 名称
        if (!name) throw "没有名称";

        git.clone(url, name, tokenInfo, (data) => {
            ws.send(JSON.stringify(data));
            if (data.end) {
                ws.close(1000, "下载完成！");
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