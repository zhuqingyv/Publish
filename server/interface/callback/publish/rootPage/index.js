/*
 * @Author: zhuqingyu
 * @Date: 2020-09-04 17:07:40
 * @LastEditTime: 2020-09-07 14:15:31
 * @LastEditors: zhuqingyu
 */
const contentType = require(PATH.COMPONENTS.CONTENT_TYPE); // 分配contentType
const fileReader = require(PATH.TOOLS.FILEREADER);
const root_path = PATH.STATIC.PUBLISH;

module.exports = function (request, response) {
    try {
        const _contentType = contentType(request.url);
        //  资源扩展名
        const format = _contentType.format;
        // content-type
        const type = _contentType.value;
        //  地址
        const url = _contentType.url;
        // 是否是媒体文件
        const ifMedia = _contentType.ifMedia;
        // 是否是字体文件
        const ifFont = _contentType.ifFont;

        // 相对路径替换
        const baseUrl = url.replace("/", "../../../../../Publish-View/dist/");
        // 资源绝对路径
        // const _path = path.resolve(__dirname, baseUrl);
        const _path = `${root_path}${url}`
        try {
            fileReader.getJson(
                _path,
                ifMedia ? "binary" : "utf8",
                (err, filedata) => {
                    if (err) {
                        throw err;
                    }
                    response.statusCode = 200;
                    response.setHeader("Content-Type", type);
                    response.write(filedata, ifMedia ? "binary" : "utf8");
                    response.end();
                }
            );
        } catch (err) {
            response.statusCode = 404;
            response.setHeader("Content-Type", "text/xml");
            response.end();
        }

    } catch (err) {
        response.statusCode = 500;
        response.setHeader("Content-Type", "text/xml");
        response.end();
    }
}