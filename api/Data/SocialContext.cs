using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;

namespace api.Data
{
    public class SocialContext
    {
        private readonly string _connectionString;

        public SocialContext(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")
                ?? throw new Exception("Missing connection string for DefaultConnection");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<T>> LoadData<T>(string sql, object? parameter = null)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<T>(sql, parameter);
        }

        public async Task<T?> LoadDataSingle<T>(string sql, object? parameter = null)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<T>(sql, parameter);
        }

        public async Task<int> ExecuteWithRowCount(string sql, object? parameter = null)
        {
            using var connection = CreateConnection();
            var result = await connection.ExecuteScalarAsync<int>(sql, parameter);
            return result;
        }

        public async Task<bool> ExecuteSql(string sql, object? parameter = null)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteAsync(sql, parameter) > 0;
        }
    }
}
