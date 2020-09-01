// const userAuthorization = {}
const admin = function () {}
const tourist = function (api) {
    const authorization = {
        "/publish/login": true, // 登陆
        "/publish/home/projects": true, // 获取列表
        "/publish/home/projects/add": true, // 新增项目
        "/publish/home/projects/install": true, // 安装一个项目
        "/publish/home/projects/build": true, // 打包一个小木
        "/publish/home/projects/online": true, // 发布一个项目
        "/publish/home/projects/delete": true // 删除一个项目
    }
    return authorization[api]
}
module.exports = {
    admin,
    tourist
}