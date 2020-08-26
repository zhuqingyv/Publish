/*
 * @Author: zhuqingyu
 * @Date: 2020-08-21 16:39:06
 * @LastEditTime: 2020-08-21 16:39:09
 * @LastEditors: zhuqingyu
 */
//开启严格模式
'use strict';

const os = require('os');

function deviceInfo() {
    if (!os) {
        return null;
    }

    const info = {
        platform: '',
        hostname: '',
        cpu: '',
        mac: ''
    };

    //操作系统平台
    const pf = os.platform();

    switch (pf) {
        case 'darwin':
            info.platform = 'macOS'
            break;
        case 'win32':
            info.platform = 'Windows'
            break;
        default:
            break;
    }

    //主机名
    info.hostname = os.hostname();

    //cpu
    const cpus = os.cpus();
    if (cpus.length) {
        info.cpu = cpus[0].model;
    }

    //网卡
    const netmap = os.networkInterfaces();
    const conf = ['en0', 'WLAN', '以太网'];

    // console.log(netmap);

    for (let index = 0; index < conf.length; index++) {
        const key = conf[index];
        const item = netmap[key];
        if (item) {
            info.mac = item[0].mac
            // console.log('mac:'+ mac);
            break;
        }
    }

    return info;
}
//module.exports 暴露接口的方法
module.exports = {
    deviceInfo: deviceInfo
};