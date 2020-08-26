/*
 * @Author: zhuqingyu
 * @Date: 2020-08-14 17:52:48
 * @LastEditTime: 2020-08-26 13:51:10
 * @LastEditors: zhuqingyu
 */
const http = require("http");
const interface = require("./interface/index.js");

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
            if (hash.api) {
                interface.callback[hash.api](hash.option, request, response)
            } else {
                response.statusCode = 404;
                response.end("null");
            }
        } catch (err) {
            console.log(err)
            response.statusCode = 500;
            response.end(err.message);
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
                    debugger
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
            return item && !item.endsWith('.css') && !item.endsWith('.js') && !item.endsWith('.png') && !item.endsWith('.jpg') && !item.endsWith('.jpeg') && !item.endsWith('.html') && !item.endsWith('.map') && !item.endsWith('.ico')
        })

        return {
            api: arr,
            is: url.endsWith('.css') || url.endsWith('.js') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.html') || url.endsWith('.map') || url.endsWith('.ico')
        }
    }
};
module.exports = server;