/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:17:03
 * @LastEditTime: 2020-08-27 13:58:25
 * @LastEditors: zhuqingyu
 */
const publish = {
    '/': {
        option: {}
    },
    'login': {
        option: {
            method: 'POST',
            body: {
                name: 'node',
                password: '123456'
            }
        },
        'page': {
            option: {
                method: 'GET',
            }

        }
    },
    'home': {
        'projects': {
            option: {
                method: 'POST'
            },
            'delete': {
                option: {
                    method: 'POST'
                }
            },
            'add': {
                option: {
                    method: 'POST'
                }
            }
        }
    } // 发布页主页
}
module.exports = {
    publish
}