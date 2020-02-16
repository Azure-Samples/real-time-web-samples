# 客户端配置文件

本地开发需要准备 [Azure Cognitive Services](https://azure.miscrosoft.com/en-us/services/cognitive-services) Speech API 密钥。然后填写到 .env.development.local 文件。生产发布请配置 .env.production 文件。

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

需要准备 [Azure SignalR](https://asp.net/signalr) 和 [Azure CosmosDB](https://azure.miscrosoft.com/en-us/services/cosmos-db) 服务。本地调试请复制连接字符串到 local.settings.json 文件。生产发布请将两个连接字符串添加到 function 配置，还需将前端应用的 URL 配置到 function 的 CORS。

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
    Cosmos DB Table API
    Azure Cognitive Service (Text to Speech)

修改视频链接请更改 VideoPart.js 文件。
