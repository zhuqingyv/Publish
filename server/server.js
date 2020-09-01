/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:48
 * @LastEditTime: 2020-09-01 15:14:42
 * @LastEditors: zhuqingyu
 */
const http = require("http");
const uuid = require("node-uuid");
const interface = require("./interface/index.js");
const testInterface = global._global.components.testInterface;
const url = require('url');
const socketHub = require('./socket/index.js');
const testAuthorization = require(PATH.COMPONENTS.TEST_AUTHORIZATION);
const testOption = require(PATH.COMPONENTS.TEST_OPTION) // 处理复杂请求第一个试探请求

const server = {
    _server: null,

    // 初始化服务器
    init(port) {
        const $this = this
        return new Promise((resolve, reject) => {
            try {
                console.log(`创建一个服务端口:${port}`);
                $this._server = http.createServer($this.getMessage.bind($this));
                $this._server.on('upgrade', $this.upgrade.bind($this))
                console.log("监听服务准备就绪事件！");
                $this._server.listen(port, resolve());
            } catch (e) {
                reject(e)
            }
        })
    },

    // 收到客户端的请求数据
    getMessage(request, response) {
        const hash = this.hash(request.url);
        try {
            // 当存在接口，并且接口符合标准
            if (hash.api && testInterface(hash.option, request)) {
                if (interface.callback[hash.api]) {
                    if (!testAuthorization(request, hash.api)) return
                    interface.callback[hash.api](request, response)
                }
            } else {
                try {
                    interface.callback['/'](request, response)
                } catch (err) {
                    throw err
                }
            }
        } catch (err) {
            response.statusCode = 500;
            response.end(typeof err === 'string' ? err : '未知错误！');
        }
    },

    // socket 通信
    upgrade(request, socket, head) {

        try {
            const pathname = url.parse(request.url).pathname // 接口名称
            const hash = this.hash(pathname); // 是否有这个接口
            const callback = interface.callback[pathname];

            if (hash.api && callback) {
                const wss = socketHub[pathname]
                if (!wss) return
                wss.handleUpgrade(request, socket, head, ws => {
                    const socketID = uuid()
                    console.log('socket=>>>>>>', pathname)
                    ws.on('message', data => {
                        callback(wss, ws, request, socket, socketID, data)
                    })
                    // 先给客户端一个唯一ID，通知其初始化，以后请求都要带上这个ID
                    ws.send(socketID)
                    ws.socketID = socketID
                })
            }
        } catch (err) {
            throw err
        }

    },

    success() {
        console.log(...arguments);
    },

    // 是否存在一个接口
    hash(url) {
        // 接口层级拆分
        const source = this.getSource(url)
        const arr = source.api
        // 初始化首层
        let cell = interface.api
        // 尝试逐层查找
        let sourceApi = ''
        try {
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i]
                if (cell[item]) {
                    sourceApi += `/${item}`;
                    cell = cell[item];
                    continue
                } else if (!cell[item] && source.is) {
                    return {
                        api: sourceApi,
                        option: cell.option
                    }
                } else {
                    throw `API: '${sourceApi}' => '${item}' is undefined !`
                }
            }
            return {
                api: `/${arr.join('/')}`,
                option: cell.option
            }
        } catch (err) {
            console.warn(err)
            return false
        }
    },

    getSource(url) {
        const arr = url.split('/').filter(item => {
            return item && !item.endsWith('.css') && !item.endsWith('.js') && !item.endsWith('.png') && !item.endsWith('.jpg') && !item.endsWith('.jpeg') && !item.endsWith('.html') && !item.endsWith('.map') && !item.endsWith('.ico') && !item.endsWith('.woff') && !item.endsWith('.ttf')
        })

        return {
            api: arr,
            is: url.endsWith('.css') || url.endsWith('.js') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.html') || url.endsWith('.map') || url.endsWith('.ico') || url.endsWith('.woff') || url.endsWith('.ttf')
        }
    }
};
module.exports = server;