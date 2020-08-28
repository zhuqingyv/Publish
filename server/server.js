/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:48
 * @LastEditTime: 2020-08-27 18:09:29
 * @LastEditors: zhuqingyu
 */
const http = require("http");
const interface = require("./interface/index.js");
const testInterface = global._global.components.testInterface

const server = {
    _server: null,
    // 初始化服务器
    init(port) {
        const $this = this
        return new Promise((resolve, reject) => {
            try {
                console.log(`创建一个服务端口:${port}`);
                $this._server = http.createServer($this.getMessage.bind($this));
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
        const host = request.headers.host;
        try {
            // 当存在接口，并且接口符合标准
            if (hash.api && testInterface(hash.option, request)) {
                if (interface.callback[hash.api]) {
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
            console.log(err)
            response.statusCode = 500;
            response.end(typeof err === 'string' ? err : '未知错误！');
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