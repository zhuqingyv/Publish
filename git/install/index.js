/*
 * @Author: zhuqingyu
 * @Date: 2020-08-28 17:44:01
 * @LastEditTime: 2020-09-04 17:04:26
 * @LastEditors: zhuqingyu
 */
const child_process = require("child_process");
const fileReader = require(PATH.TOOLS.FILEREADER);

module.exports = function (ID, callback) {

    try {
        const project = JSON.parse(fileReader.getJson(`${PATH.JSON.PUBLISH}`))
            .projects[ID]; // 项目信息
        const command = `cd ${PATH.GITHUB_PATH}/${ID}/${project.gitName}`;

        console.log(`执行【${command}】`)

        child_process.exec(command, (err, stdout, stderr) => {
            if (err) {
                callback({
                    info: '项目文件已经移除',
                    type: 'warn',
                    end: true
                })
                return
            }

            console.log('进入文件夹成功！', 'stdout', stdout, 'stderr', stderr)

            console.log(`开始安装${project.gitName}`)

            callback({
                info: command,
                type: 'log',
                end: false
            })

            callback({
                info: `开始安装: 【${project.gitName}】`,
                type: 'log',
                end: false
            })

            const running = child_process.spawn('cnpm', ['install'], {
                cwd: `${PATH.GITHUB_PATH}/${ID}/${project.gitName}`
            })

            running.stdout.on('data', data => {
                if (!data) return
                const info = data.toString()
                if (info) {
                    callback({
                        info,
                        type: 'log',
                        end: false
                    })
                }
            })

            running.stderr.on('data', (data) => {
                if (!data) return
                const info = data.toString()
                if (info) {
                    callback({
                        info,
                        type: 'warn',
                        end: false
                    })
                }
            });

            running.stdout.on('end', () => {
                callback({
                    info: `【${project.gitName}】安装完毕！`,
                    type: 'log',
                    end: true
                })
            })

        })
    } catch (err) {
        callback({
            err: err
        })
    }

};