# 问题小结

1. `./bin/www`里修改默认端口

## react

### 路由监听方式


点击浏览器返回按钮，页面不刷新


## fs文件系统

`fs.readFile(path, callback)`与`fs.readFileSync(path)`方法关于参数`path`使用`<URL>`格式

`fs.readFile`和`fs.readFileSync`方法与`fs`其他API一样，只能处理本地系统中的文件。所以`URl`只有`file://`协议可以使用

## soap协议
soap（simple object access protocol，即简单对象访问协议）是交换数据的一种协议规范。

- SOAP消息必须用XML来编码
- SOAP消息必须使用SOAP Envelope名字空间
- SOAP消息必须使用SOAP Encoding名字空间
- SOAP消息不能包含DTD引用
- SOAP消息不能包含XML处理指令

**参考资料**
- [How to Perform SOAP Requests With Node.js](https://betterprogramming.pub/how-to-perform-soap-requests-with-node-js-4a9627070eb6)

## 图片编码格式
**参考资料**
- [HEIF/heic图片文件解析](https://zhuanlan.zhihu.com/p/35847861)
- [Heic 文件格式解析（原创）](https://www.freebuf.com/column/164833.html)
- [What is EXIF Data and How You Can Remove it From Your Photos](https://photographylife.com/what-is-exif-data)
- [https://docs.fileformat.com](https://docs.fileformat.com/image/exif/)这个网站关于各种文件的说明特全