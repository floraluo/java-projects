# NAS服务器的代理
移动硬盘做了一个小型NAS服务器。使用node通过DLNA协议访问，代理客户端的请求。

开始需求为：将硬盘里儿子的照片展示在页面上，添加某些照片的备注即修改照片的元数据信息（主要是userComment）。展示功能完成开始学习修改元数据功能的技术时，发现了几个问题，实现起来不太容易，被迫放弃修改元数据功能，仅有展示功能。修改照片元数据功能打算另外写一个工具。

**题外话：**搜索设备代码写好后，我家里支持DLNA协议访问的设备都让我搜出来了，看到【小度大金刚】的名字时，感觉有点好玩。看了相关文章后，觉得以后能写个小玩意儿控制我家所有的电器。之前在老家待产时，发现家里电视和空调都有官方app可以手机遥控。自己鼓捣一个app“一统天下”莫名觉得还是很有成就感的样子。虽然小度音响就是一个万能遥控器，有过小宝宝的应该知道，千辛万苦哄睡怎么可能再吼几声”小度，小度！打开空调！“”小度小度，空调设置25度“。。。

## 遇到的问题
1. 读写图片元数据需要分析图片的格式，.jpeg/.png/.heic等等后缀名的图片格式都不一样；
2. 远程修改NAS服务器上图片元数据（主要这一步迫使我放弃）；
3. ssdp协议查找设备时，注意精确传入服务参数；


## 项目目录结构

- controllers：控制器
- routes：路由
- utils：工具包
  - browseroot.data<sub>发送soap请求时，需要发送的xml内容</sub>
  - Device.js<sub>关于搜索DLNA设备的封装</sub>
  - soap.js<sub>封装的发送soap请求方法</sub>
- app.js：入口文件
- note.md：笔记
## 项目说明

```
#使用koa2脚手架生成项目
koa2 <projectName>

#启动服务
npm start
```
### 插件

- [node-ssdp](https://github.com/diversario/node-ssdp)<sub>使用ssdp协议搜索DLNA设备</sub>
- [upnp-device-client](https://github.com/thibauts/node-upnp-device-client)<sub>用ssdp协议发现的设备描述配置文件地址实例化一个客户端，用来获取设备的信息</sub>
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)<sub>解析xml文件</sub>


### 核心逻辑

#### 怎样浏览DLNA媒体服务器
1. 使用SSDP协议找到设备,获取到关于设备的根目录描述文件`rootDesc.xml`地址；
2. 获取到`rootDesc.xml`文件内容，解析xml文件转化成js对象，拿到`urn:upnp-org:serviceId:ContentDirectory`服务的`controlURL`以及其他关键信息，比如设备名称等；
3.  新建`browseroot.data`配置文件，读取文件内容，使用soap协议发送请求，获取到根目录的内容；
4.  获取到根目录的`ObjectId`，再次发送soap请求获取子目录内容；
5.  子目录有文件时，解析xml文件，获取到文件的信息。

**参考资料：**
- [https://developer.sony.com/develop/audio-control-api/get-started/browse-dlna-file](https://developer.sony.com/develop/audio-control-api/get-started/browse-dlna-file)
- [DLNA 与 UPnP 初探](https://www.jianshu.com/p/91b508b0260b)
- [DLNA 协议分析及应用](https://breezetemple.github.io/2019/02/25/dlan-introduction/)
- [DLNA相关知识](https://www.jianshu.com/p/af63d98f8f4b)

