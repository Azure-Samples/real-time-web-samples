
## 使用Azure SignalR服务快速开发实时交互应用示例代码

## 示例1 一站式防疫信息实时互动开源项目

### 功能介绍
**实时弹幕**: 在用户端页面通过视频下方的聊天窗口，在线用户可以发送聊天信息，信息以弹幕形式实时显示在所有在线用户的视频屏幕上。

**实时通知**: 通过管理端的通知群发页面发送通知文本，所有在线用户可在用户端页面顶部接收到通知文本，并有自动语音朗读。

**实时统计**: 以柱状图的形式实时更新累计用户、弹幕、通知数量。

示例截图:
![Screenshot](CoronavirusPneumoniaProgramDemo/sceenshots/screenshot1.jpg)

### 如何使用

**Azure技术:** 使用Azure SignalR服务实现实时交互，集成SignalR扩展的Azure Functions提供API服务托管，Azure Cosmos DB Table API用于数据存储及Cognitive Speech服务用于文本转语音。

[代码及介绍](CoronavirusPneumoniaProgramDemo/README.md)

## 示例2 实时航班地图

[代码](FlightMap/README.md)

## 资源链接

- [Azure SignalR Service document](https://aka.ms/signalr_service_doc)
- [Azure SignalR Service product page](https://azure.microsoft.com/services/signalr-service/)
- [Azure SignalR Service overview](https://dotnet.microsoft.com/apps/aspnet/signalr/service)
- [Azure Cognitive Speech Service](https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/)
