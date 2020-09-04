/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:17:03
 * @LastEditTime: 2020-09-04 16:14:58
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
                option: {}
            },
            'install': {
                option: {}
            },
            'build': {
                option: {}
            },
            'online': {
                option: {}
            }
        }
    }, // 发布页主页
    'Desktop': {}
}
module.exports = {
    publish
}