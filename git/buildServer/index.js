/*
 * @Author: zhuqingyu
 * @Date: 2020-08-31 14:08:50
 * @LastEditTime: 2020-08-31 18:22:15
 * @LastEditors: zhuqingyu
 */
const child_process = require("child_process");
const setFolder = require(PATH.SET_FOLDER);
const fileReader = require(PATH.FILEREADER_PATH);
const getPort = require(PATH.TOOLS.GET_PORT);
const killPort = require(PATH.KILL_PORT);

module.exports = function (projectID, callback) {
    let project
    try {
        project = JSON.parse(fileReader.getJson(`${PATH.PUBLISH_JSON}`)).projects[projectID]
    } catch (err) {
        callback({
            info: '项目不存在！',
            end: true,
            port: null
        })
    }

    const projectPath = `${PATH.GITHUB_PATH}/${projectID}/${project.gitName}`
    let port = 8082
    // 找到 dist 目录
    setFolder.find(`${projectPath}/dist`).then(() => {
        callback({
            info: '项目存在dist文件',
            end: false,
            port
        })
        getPort(port).then(_port => {
            killPort(port).then(() => {
                port = _port
                callback({
                    info: `项目最终运行在端口：${port}`,
                    end: false,
                    port
                })
                // 修改项目记录数据
                const json = JSON.parse(fileReader.getJson(PATH.PUBLISH_JSON));
                project.port = port
                json.projects[projectID] = project
                fileReader.setJson(PATH.PUBLISH_JSON, JSON.stringify(json, null, '\t'))

                const running = child_process.spawn('http-server', ['-p', port], {
                    cwd: `${projectPath}/dist`
                })
                running.stdout.on("data", (data) => {
                    if (!data || !callback) return;
                    const info = data.toString();
                    if (info) {
                        callback({
                            info,
                            type: "log",
                            end: false,
                            port
                        });
                    }
                });

                running.stderr.on("data", (data) => {
                    if (!data || !callback) return;
                    const info = data.toString();
                    if (info) {
                        callback({
                            info,
                            type: "warn",
                            end: false,
                            port
                        });
                    }
                });

                running.stdout.on('end', () => {
                    if (!callback) return;
                    callback({
                        info: `【${project.gitName}】命令执行结束`,
                        type: 'log',
                        end: true,
                        port
                    })
                })
            }).catch(() => {
                callback({
                    info: '没有可用端口',
                    end: true,
                    port: null
                })
            })
        }).catch(() => {
            callback({
                info: '没有可用端口',
                end: true,
                port: null
            })
        })
    }).catch(() => {
        callback({
            info: `项目不存在 '/dist' 目录，尝试在跟目录寻找 index.html'`,
            end: false,
            port
        })
        try {
            // 找到目录下的 index.html
            if (fileReader.getJson(`${projectPath}/index.html`)) {
                callback({
                    info: `项目 存在index.html'`,
                    end: false,
                    port
                })

                getPort(port).then(_port => {
                    killPort(port).then(() => {
                        port = _port
                        callback({
                            info: `项目最终运行在端口：${port}`,
                            end: false,
                            port
                        })
                        // 修改项目记录数据
                        const json = JSON.parse(fileReader.getJson(PATH.PUBLISH_JSON));
                        project.port = port
                        json.projects[projectID] = project
                        fileReader.setJson(PATH.PUBLISH_JSON, JSON.stringify(json, null, '\t'))

                        const running = child_process.spawn(`http-server`, ['-p', port], {
                            cwd: `${projectPath}`
                        })
                        running.stdout.on("data", (data) => {
                            if (!data || !callback) return;
                            const info = data.toString();
                            console.log(info)
                            if (info) {
                                callback({
                                    info,
                                    type: "log",
                                    end: false,
                                    port
                                });
                            }
                        });

                        running.stderr.on("data", (data) => {
                            if (!data || !callback) return;
                            const info = data.toString();
                            console.log(info)
                            if (info) {
                                callback({
                                    info,
                                    type: "warn",
                                    end: false,
                                    port
                                });
                            }
                        });

                        running.stdout.on('end', () => {
                            if (!callback) return;
                            callback({
                                info: `【${project.gitName}】命令执行结束`,
                                type: 'log',
                                end: true,
                                port
                            })
                        })
                    }).catch(() => {
                        callback({
                            info: '没有可用端口',
                            end: true,
                            port: null
                        })
                    })
                }).catch(() => {
                    callback({
                        info: '没有可用端口',
                        end: true,
                        port: null
                    })
                })
            }
        } catch (err) {
            callback({
                info: '项目无法发布',
                end: true,
                port: null
            })
        }
    })
}