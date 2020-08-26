# Publish简介
## 功能
	  主要是利用nodejs的child_process进行操作本地shell.该项目为开源项目，目前实现了简单的登陆以及增加、删除远程服务器 github 的仓库。
	接着这个思路未来可以实现远程服务器中的github项目的启动，build，发布等等操作。可以理解为一个建议版本的Jenkins。
	不同于以往的项目，该项目没有使用数据库，全程数据都是靠json文件的读写完成的。

**好处**

用户无需在服务器里安装数据库就可以实现本地数据存储，同时自己可以自定义json的格式，而且json相比传统数据库表来说更加直观。

**缺点**

相比数据库取数据的速度可能要慢一些。我的本意是利用js模块化的思路以及Proxy对json进行模块化以及实时数据监听，用户只需要将json通过require引入进来，通过proxy进行深层次的劫持，只要该模块有一处发生改变，触发了set或者deletePropty就找到root数据源，并且更新整个模块。然后通过一个统一的模块拼凑起来所有的json模块，这样就可以统一管理所有的json数据了。又因为nodejs支持同步/异步写入，接着同步的API，开发者不需要再关注fs何时修改json，以及层层的Promise关系,只需要关注json转换为js对象以后的修改即可看到项目里json文件自动修改。
例如：
```javascript
	const jsoner = require("jsoner"); // 这个就是写好的json监听系统
	const path = require("path"); // 不懂的可以查nodejs path 模块
	//const _json = require("./json");
	const json = jsoner(path.resolve(__dirname)) // 此时修改json对象本地json就会同步修改
	module.exports = json // 通过模块化将json对象对应的.json文件通过 'path' 联系起来
```

#### 槽点
	全程没有使用express框架搭建，完全是nodejs原生实现。
	所以一般的网页 GET请求在这个项目里都需要自己亲自配置。加载一张图片都需要一步步配置才能显示在浏览器里。
	所有的数据都是以流的形式出现，要将流处理成浏览器需要的内容，也就是从buffer转成任何需要的格式。
	同时也要根据不同的类型匹配相应的编码标准，content-type，
	以及不同的请求头以及解码方式。

### [github地址](https://github.com/zhuqingyv/Publish)
