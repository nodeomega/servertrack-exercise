using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServerTrack.Models
{
    public class LoadRecord
    {
        public string ServerName { get; set; }

        public double CpuLoad { get; set; }

        public double RamLoad { get; set; }

        public DateTimeOffset TimeStamp { get; set; }
    }
}