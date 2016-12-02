using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Threading.Tasks;
using System.Web;

namespace ServerTrack.Helpers
{
    public class MemoryCacheHelper
    {
        public async Task<object> GetValue(string key)
        {
            var memoryCache = MemoryCache.Default;
            return await Task.Run(() => memoryCache.Get(key));
        }

        public async Task<bool> Add(string key, object value, DateTimeOffset absoluteExperation)
        {
            var memoryCache = MemoryCache.Default;
            return await Task.Run(() => memoryCache.Add(key, value, absoluteExperation));
        }

        public async Task Delete(string key)
        {
            var memoryCache = MemoryCache.Default;
            if (memoryCache.Contains(key))
            {
                await Task.Run(() => memoryCache.Remove(key));
            }
        }
    }
}