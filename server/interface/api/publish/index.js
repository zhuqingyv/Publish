/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:17:03
 * @LastEditTime: 2020-08-25 10:42:12
 * @LastEditors: zhuqingyu
 */
const publish = {
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
    'home': {} // 发布页主页
}
module.exports = {
    publish
}