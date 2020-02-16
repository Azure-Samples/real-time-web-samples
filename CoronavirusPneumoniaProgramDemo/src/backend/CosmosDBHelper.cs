using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace FunctionApp
{
    public class CosmosDBHelper
    {
        private string _storageConnectionString;

        public CosmosDBHelper(IOptions<DBSettings> options)
        {
            _storageConnectionString = options.Value.StorageConnectionString;
        }

        public CloudStorageAccount CreateStorageAccountFromConnectionString(string storageConnectionString)
        {
            CloudStorageAccount storageAccount;
            storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            return storageAccount;
        }

        public async Task<CloudTable> CreateTableAsync(string tableName)
        {
            string storageConnectionString = _storageConnectionString;
            CloudStorageAccount storageAccount = CreateStorageAccountFromConnectionString(storageConnectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
            CloudTable table = tableClient.GetTableReference(tableName);
            await table.CreateIfNotExistsAsync();
            return table;
        }

        public async Task<CloudTable> CreateTableAsync(CloudTableClient tableClient, string tableName)
        {
            CloudTable table = tableClient.GetTableReference(tableName);
            await table.CreateIfNotExistsAsync();
            return table;
        }

        public async Task<DataEntity> RetrieveEntityUsingPointQueryAsync(CloudTable table, string partitionKey, string rowKey)
        {
            TableOperation retrieveOperation = TableOperation.Retrieve<DataEntity>(partitionKey, rowKey);
            TableResult result = await table.ExecuteAsync(retrieveOperation);
            DataEntity data = result.Result as DataEntity;
            return data;
        }

        public async Task<DataEntity> InsertOrMergeEntityAsync(CloudTable table, DataEntity entity)
        {
            TableOperation insertOrMergeOperation = TableOperation.InsertOrMerge(entity);
            TableResult result = await table.ExecuteAsync(insertOrMergeOperation);
            DataEntity insertedData = result.Result as DataEntity;
            return insertedData;
        }
    }
    public class DataEntity : TableEntity
    {
        public DataEntity()
        {
        }

        public DataEntity(string partitionKey, string rowKey)
        {
            PartitionKey = partitionKey;
            RowKey = rowKey;
        }

        public int IntValue { get; set; }
        public string StringValue { get; set; }
    }

    public class DBSettings
    {
        public string StorageConnectionString { get; set; }
    }
}
