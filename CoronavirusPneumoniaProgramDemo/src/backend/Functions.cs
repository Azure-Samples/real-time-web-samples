using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace FunctionApp
{
    public class Functions
    {
        private CosmosDBHelper _cosmosDBHelper;
        private CloudTable _table;
        public Functions(IOptions<DBSettings> options)
        {
            _cosmosDBHelper = new CosmosDBHelper(options);
            _table = AsyncHelper.RunAsync(async () =>
            {
                return await _cosmosDBHelper.CreateTableAsync("demo");
            });
        }

        [FunctionName("negotiate")]
        public SignalRConnectionInfo GetSignalRInfo(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = "chat")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }

        [FunctionName("messages")]
        public async Task SendMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] object message,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            DataEntity commentCount = new DataEntity("demo", "CommentCount")
            {
                IntValue = 0
            };
            var data = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "CommentCount");
            if (data != null)
            {
                commentCount.IntValue = data.IntValue + 1;
            }

            await _cosmosDBHelper.InsertOrMergeEntityAsync(_table, commentCount);

            await SendChartData(signalRMessages);
            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "newMessage",
                    Arguments = new[] { message }
                });
        }

        [FunctionName("notice")]
        public async Task SendNotice(
           [HttpTrigger(AuthorizationLevel.Anonymous, "post")] object notice,
           [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            DataEntity noticeCount = new DataEntity("demo", "NoticeCount")
            {
                IntValue = 0
            };
            var data = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "NoticeCount");
            if (data != null)
            {
                noticeCount.IntValue = data.IntValue + 1;
            }

            DataEntity noticeText = new DataEntity("demo", "NoticeText")
            {
                StringValue = (string)notice
            };

            await _cosmosDBHelper.InsertOrMergeEntityAsync(_table, noticeCount);
            await _cosmosDBHelper.InsertOrMergeEntityAsync(_table, noticeText);

            await SendChartData(signalRMessages);
            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "newNotice",
                    Arguments = new[] { notice }
                });
        }

        [FunctionName("getNotice")]
        public async Task GetNotice(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            DataEntity audienceCount = new DataEntity("demo", "AudienceCount")
            {
                IntValue = 0
            };
            var data = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "AudienceCount");
            if (data != null)
            {
                audienceCount.IntValue = data.IntValue + 1;
            }

            await _cosmosDBHelper.InsertOrMergeEntityAsync(_table, audienceCount);

            var noticeText = "";
            data = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "NoticeText");
            if (data != null)
            {
                noticeText = data.StringValue;
            }

            await SendChartData(signalRMessages);
            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "newNotice",
                    Arguments = new[] { noticeText }
                });
        }

        [FunctionName("chart")]
        public async Task GetChartData(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            await SendChartData(signalRMessages);
        }

        private async Task SendChartData(IAsyncCollector<SignalRMessage> signalRMessages)
        {
            var commentCount = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "CommentCount");
            if (commentCount == null)
            {
                commentCount = new DataEntity("demo", "CommentCount")
                {
                    IntValue = 0
                };
            }

            var noticeCount = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "NoticeCount");
            if (noticeCount == null)
            {
                noticeCount = new DataEntity("demo", "NoticeCount")
                {
                    IntValue = 0
                };
            }

            var audienceCount = await _cosmosDBHelper.RetrieveEntityUsingPointQueryAsync(_table, "demo", "AudienceCount");
            if (audienceCount == null)
            {
                audienceCount = new DataEntity("demo", "AudienceCount")
                {
                    StringValue = ""
                };
            }

            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "updateChart",
                    Arguments = new[] { new {
                        commentCount = commentCount.IntValue,
                        noticeCount = noticeCount.IntValue,
                        audienceCount = audienceCount.IntValue
                    }}
                });
        }
    }
}
