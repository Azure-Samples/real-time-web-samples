# 疫情消息实时播报平台

2020年初，新型冠状病毒疫情使得中国很多人在家远程工作或者学习，获得消息的时效性和远程的实时沟通显得特别重要。很多中小微企业和个人并未做好充分的技术准备，使得突如其来的疫情打乱了很多的日常工作安排。很多典型的实时场景，其实可以通过微软几种云服务组合起来，经过简单的开发就可以实现。这个平台就是基于此目的，展示如何快速在微软云搭建一些典型的实时功能。希望我们的实例可以激发更多开发人员快速上手，开发出各种有效的实时应用。这也是我们微软部分员工在此时刻的小小贡献。

# 客户端配置文件

本地开发需要准备 [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) Speech API 密钥。然后填写到 .env.development.local 文件。生产发布请配置 .env.production 文件。

```
# .env.development.local
REACT_APP_API_BASE_URL=
REACT_APP_SPEECH_KEY=
REACT_APP_SPEECH_REGION=

# 本地运行命令如下
$ npm i
$ npm start
```

# Azure function 配置文件

需要准备 [Azure SignalR](https://azure.microsoft.com/services/signalr-service/) 和 [Azure CosmosDB](https://azure.microsoft.com/services/cosmos-db/) 服务。本地调试请复制连接字符串到 local.settings.json 文件。生产发布请将两个连接字符串添加到 function 配置，还需将前端应用的 URL 配置到 function 的 CORS。

```
# local.settings.json
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

本demo使用如下Azure技术

    Azure Storage (视频存储) 
    Azure Functions
    Azure SignalR
    Cosmos DB's Table API
    Azure Cognitive Service (Text to Speech)

修改视频链接请更改 VideoPart.js 文件。
