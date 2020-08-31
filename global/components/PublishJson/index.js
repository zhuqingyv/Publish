/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 15:55:56
 * @LastEditTime: 2020-08-31 14:43:34
 * @LastEditors: zhuqingyu
 * git目录下所有项目的json集合，用于处理json
 */
const path = require("path");

const publishJson = {
  fileReader: null,
  // 获取某一个项目的json数据
  find(id) {
    try {
      let publishJson = this.getPublishjson();
      return publishJson.projects[id];
    } catch (err) {
      return err;
    }
  },
  // 追加一条项目
  add(json) {
    const $this = this;
    return new Promise((resolve, reject) => {
      try {
        const id = json.id;
        const description = json.description;
        const version = json.version;
        const publishJson = JSON.parse($this.getPublishjson());
        const projects = publishJson.projects;
        const newPublich_path = $this.publish_path;
        projects[id] = json;
        const newPublish = $this.fileReader.setJson(
          newPublich_path,
          JSON.stringify(publishJson)
        );
        console.log("newPublish", newPublish);
        resolve(newPublish);
      } catch (e) {
        reject(e);
      }
    });
  },
  // 删除
  delete(data) {
    const $this = this;
    return new Promise((resolve, reject) => {
      try {
        const allPromise = [];
        const publishJson = $this.getPublishjson(true);

        let arr;
        arr = data instanceof Array ? data : [data];
        arr.forEach((project) => {
          allPromise.push($this._delete(project, publishJson));
        });
        Promise.all(allPromise).then(() => {
          let newPublish = JSON.stringify(publishJson);
          let newPublich_path = $this.publish_path;
          this.fileReader.setJson(newPublich_path, newPublish);
          resolve(newPublish);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  // 单条删除
  _delete(id, publishJson) {
    return new Promise((resolve, reject) => {
      try {
        const projects = publishJson.projects;
        delete projects[id];
        resolve(publishJson);
      } catch (err) {
        reject(err);
      }
    });
  },
  // 获取 publish.json
  getPublishjson(ifParse) {
    // publish.json 地址
    const publish_path = this.publish_path;
    try {
      const json = this.fileReader.getJson(publish_path);
      return ifParse ? JSON.parse(json) : json;
    } catch (e) {
      return e;
    }
  },
  // publish.json 的绝对路径
  get publish_path() {
    return path.resolve(__dirname, "../../../git/publish.json");
  },
};
module.exports = function (fileReader) {
  publishJson.fileReader = fileReader;
  return publishJson;
};