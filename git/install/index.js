/*
 * @Author: zhuqingyu
 * @Date: 2020-08-28 17:44:01
 * @LastEditTime: 2020-08-29 01:05:20
 * @LastEditors: zhuqingyu
 */
const child_process = require("child_process");
const fileReader = require(PATH.FILEREADER_PATH);

module.exports = function (ID, callback) {

    try {
        const project = JSON.parse(fileReader.getJson(`${PATH.PUBLISH_JSON}`))
            .projects[ID]; // 项目信息
        const command = `cd ${PATH.GITHUB_PATH}/${ID}/${project.gitName}`;

        console.log(`执行【${command}】`)

        child_process.exec(command, (err, stdout, stderr) => {
            if (err) {
                callback({
                    err
                })
                return
            }

            console.log('进入文件夹成功！', 'stdout', stdout, 'stderr', stderr)

            console.log(`开始安装${project.gitName}`)

            callback({
                installInfo: command,
                type: 'log',
                end: false
            })

            callback({
                installInfo: `开始安装: 【${project.gitName}】`,
                type: 'log',
                end: false
            })

            const running = child_process.spawn('npm', ['install'], {
                cwd: `${PATH.GITHUB_PATH}/${ID}/${project.gitName}`
            })

            running.stdout.on('data', data => {
                if (!data) return
                const installInfo = data.toString()
                if (installInfo) {
                    callback({
                        installInfo,
                        type: 'log',
                        end: false
                    })
                }
            })

            running.stderr.on('data', (data) => {
                if (!data) return
                const installInfo = data.toString()
                if (installInfo) {
                    callback({
                        installInfo,
                        type: 'warn',
                        end: false
                    })
                }
            });

            running.stdout.on('end', () => {
                callback({
                    installInfo: `【${project.gitName}】安装完毕！`,
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