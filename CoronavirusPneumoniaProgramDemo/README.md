# 疫情消息实时播报平台

2020年初，新型冠状病毒疫情使得中国很多人在家远程工作或者学习，获得消息的时效性和远程的实时沟通显得特别重要。很多中小微企业和个人并未做好充分的技术准备，使得突如其来的疫情打乱了很多的日常工作安排。很多典型的实时场景，其实可以通过微软几种云服务组合起来，经过简单的开发就可以实现。这个平台就是基于此目的，展示如何快速在微软云搭建一些典型的实时功能。希望我们的实例可以激发更多开发人员快速上手，开发出各种有效的实时应用。这也是我们微软部分员工在此时刻的小小贡献。

演示程序截图:
![Screenshot](sceenshots/screenshot1.jpg)

# 客户端应用配置
1. 在Azure管理门户中创建Speech服务，获取服务密钥及区域。[参考](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started#try-the-speech-service-using-a-new-azure-account)
2. 将获取的信息添加到本地开发配置文件.env.development.local中对应的**REACT_APP_SPEECH_KEY**以及**REACT_APP_SPEECH_REGION**配置项。
3. **REACT_APP_API_BASE_URL**为服务端应用的地址链接

```
REACT_APP_API_BASE_URL=
REACT_APP_SPEECH_KEY=
REACT_APP_SPEECH_REGION=
```
3. 本地运行客户端应用可使用如下命令
```
$ npm i
$ npm start
```

4. 客户端应用可正式环境可发布到Azure应用服务甚至是Azure存储服务的"静态网站", 发布前请将添加以上配置信息到 .env.production 文件中。


# 服务端应用配置
1. 在本地通过Azure Functions模拟器运行服务端程序，需添加**local.settings.json**配置文件。
2. 在Azure管理门户中创建SignalR服务，获取服务连接字符串，添加的到配置文件中的**AzureSignalRConnectionString**配置项。
3. 在Azure管理门户中创建Cosmos DB，获取数据库连接字符串，添加的到配置文件中的**DBSettings**下的**StorageConnectionString**配置项。
4. 部署服务端应用需在Azure管理门户创建Functions服务，并将以上信息配置到对应的Functions配置信息中。
5. 还需将Functions服务的CORS功能启用，并将客户端应用的发布连接添加至CORS记录，以允许客户端应用可以调用此服务端。

```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "AzureSignalRConnectionString": ""
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "http://localhost:3000",
    "CORSCredentials": true
  },
  "DBSettings": {
    "StorageConnectionString": ""
  }
}
```

# 其他
1. 修改视频链接可在客户端代码中修改VideoPart.js。
2. 在本开源代码基础之上还可进行二次开发以添加更多自定义场景。例如通过Azure翻译服务将文字弹幕翻译成多国语言，或者使用Azure媒体服务将高清及超大视频文件编码处理以获得更流畅的播放体验。还可以使用媒体服务的直播功能，增加实时直播功能。
