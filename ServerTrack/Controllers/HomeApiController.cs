using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using ServerTrack.Helpers;
using ServerTrack.Models;

namespace ServerTrack.Controllers
{
    public class HomeApiController : ApiController
    {
        private static List<LoadRecord> _loadRecords = new List<LoadRecord>();

        [ActionName("EnterNewRecordLoad")]
        [HttpPost]
        public async Task<dynamic> EnterNewRecordLoad([FromBody] dynamic settings)
        {
            try
            {
                var settingConfig = System.Web.Helpers.Json.Decode(settings.ToString());

                var serverName = settingConfig.serverName;

                var cpuLoad = ((string)settingConfig.cpuLoad).ToNullableDouble() ?? 0;
                var ramLoad = ((string)settingConfig.ramLoad).ToNullableDouble() ?? 0;

                var memHelper = new MemoryCacheHelper();

                _loadRecords = await memHelper.GetValue("LoadRecords") as List<LoadRecord> ?? new List<LoadRecord>();

                var newRecord = new LoadRecord
                {
                    CpuLoad = cpuLoad,
                    RamLoad = ramLoad,
                    ServerName = serverName,
                    TimeStamp = DateTimeOffset.UtcNow
                };

                _loadRecords.Add(newRecord);

                await memHelper.Add("LoadRecords", _loadRecords, DateTimeOffset.UtcNow.AddYears(1));

                return new { Success = true, Message = string.Empty };
            }
            catch (Exception exception)
            {
                return new { Success = false, Message = $"Failed to record load.  {exception.Message}" };
            }
        }

        [ActionName("GetLoadData")]
        [HttpPost]
        public async Task<dynamic> GetLoadData([FromBody] dynamic settings)
        {
            try
            {
                var settingConfig = System.Web.Helpers.Json.Decode(settings.ToString());

                var serverName = settingConfig.serverName;

                var memHelper = new MemoryCacheHelper();

                _loadRecords = await memHelper.GetValue("LoadRecords") as List<LoadRecord>;
                if (_loadRecords == null || _loadRecords.Count <= 0)
                {
                    _loadRecords = await GenerateTestData(); //new List<LoadRecord>();
                    await memHelper.Add("LoadRecords", _loadRecords, DateTimeOffset.UtcNow.AddYears(1));
                }

                var serverRecords = _loadRecords.Where(record => record.ServerName == serverName && record.TimeStamp >= DateTimeOffset.UtcNow.Subtract(new TimeSpan(1, 0, 0, 0))).ToList();

                var serverAverageHourLoad =
                    serverRecords.Where(
                        record => record.TimeStamp >= DateTimeOffset.UtcNow.Subtract(new TimeSpan(1, 0, 0)))
                        .GroupBy(record => new { TimeKey = record.TimeStamp.ToString("HH:mm") })
                        .Select(
                            group =>
                                new
                                {
                                    CpuLoad = group.Average(p => p.CpuLoad),
                                    RamLoad = group.Average(p => p.RamLoad),
                                    group.First().ServerName,
                                    group.Key.TimeKey
                                }).OrderBy(list => list.TimeKey);

                var serverAverageDayLoad = serverRecords.GroupBy(
                    record => new { TimeKey = record.TimeStamp.ToString("MM/dd/yyyy HH:00") })
                    .Select(
                        group =>
                            new
                            {
                                CpuLoad = group.Average(p => p.CpuLoad),
                                RamLoad = group.Average(p => p.RamLoad),
                                group.First().ServerName,
                                group.Key.TimeKey
                            }).OrderBy(list => list.TimeKey);


                return new { HourReport = serverAverageHourLoad, DayReport = serverAverageDayLoad };

                //return new { Success = true, Message = string.Empty };
            }
            catch
            {
                return new { Success = false, Message = "Failed to record load." };
            }
        }

        private async Task<List<LoadRecord>> GenerateTestData()
        {
            var result = new List<LoadRecord>();

            await Task.Run(() =>
            {
                for (var i = 0; i < 5000; i++)
                {
                    result.Add(new LoadRecord
                    {
                        ServerName = "test",
                        CpuLoad = RandomLoad(),
                        RamLoad = RandomLoad(),
                        TimeStamp = RandomDateTimeOffset()
                    });
                }
            });

            return result;
        }

        private static readonly Random Random = new Random();

        private static double RandomLoad()
        {
            var next = Random.NextDouble();

            return 0 + next * (100 - 0);
        }

        private static int RandomIntRange(int min, int max)
        {
            return Random.Next(min, max);
        }

        private static DateTimeOffset RandomDateTimeOffset()
        {
            var nextHour = RandomIntRange(0, 24);
            var nextMinute = RandomIntRange(0, 60);
            var nextSecond = RandomIntRange(0, 60);

            return new DateTimeOffset(DateTime.UtcNow.Subtract(new TimeSpan(nextHour, nextMinute, nextSecond)));
        }
    }
}
