/*
 * @Author: zhuqingyu
 * @Date: 2020-08-18 18:43:16
 * @LastEditTime: 2020-08-21 15:43:54
 * @LastEditors: zhuqingyu
 */
const puppeteer = require("puppeteer");
const path = require("path");
const screenshot = require("./screenshot/index.js");
let request = require("request-promise-native");
const {
    getDomInfo
} = require("./dom/index.js");

module.exports = async function a() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100, //放慢浏览器执行速度，方便测试观察
        args: [
            //启动 Chrome 的参数，详见上文中的介绍
            "–no-sandbox",
        ],
    });
    const page = await browser.newPage();
    //设置可视区域大小
    await page.setViewport({
        width: 1920,
        height: 800
    });

    await page.goto("https://soundpool-fz.jiaoyanyun.com/");

    // console.log(page.mouse.move)
    // console.log(browser.event);
    //对整个页面截图
    await page.screenshot({
        path: path.resolve(__dirname, "./image/capture.png"), //图片保存路径
        type: "png",
        fullPage: true, //边滚动边截图
        // clip: {x: 0, y: 0, width: 1920, height: 800}
    });
    //对页面某个元素截图
    let element = await page.$$(".out");
    let parentElement = await page.$(".scrollView-child");
    let scrollView = await page.$$(".scrollView");
    scrollView.scroll;
    let allShot = [parentElement];
    await element.forEach(async (item, index) => {
        setTimeout(async () => {
            await getDomInfo(item).then((e) => {
                const _path = path.resolve(__dirname, `./image/element${index}.png`);
                allShot.push(screenshot(item, _path, index));
            });
        }, index * 1000);
    });
    Promise.all(allShot).then(async () => {
        console.log("完成截图！页面开始关闭");
        await page.close();
        console.log("页面已经关闭！浏览器开始关闭");
        await browser.close();
        console.log("浏览器已经关闭");
        process.exit(0);
    }).catch(e => {
        debugger
    });
};