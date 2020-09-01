const rule = require("./user.js");
const getBody = require(PATH.COMPONENTS.GET_BODY);
const crypto = require(PATH.CRYPTO_PATH);
module.exports = async function (request, api) {
    if (request.method.toLowerCase() == 'options') return true
    let body
    await getBody(request).then((data) => {
        body = JSON.parse(data[0])
    }).then(() => {
        body = {}
    })
    if (!body.token) return true

    const userInfo = JSON.parse(crypto.Decrypt(body.token, "1995"));
    const name = userInfo.name
    if (name === 'tourist') {
        return rule.tourist(api)
    } else if (name === 'admin') {
        return true
    }
}