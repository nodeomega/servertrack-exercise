/*
Created by: Jon Russell (jrussell@nodeomega.com)
*/
var Core;
(function (Core) {
    "use strict";
    // angular app services.
    var Application;
    (function (Application) {
        var Services;
        (function (Services) {
            var LoadRecordService = (function () {
                function LoadRecordService($http, $location) {
                    this.http = $http;
                    this.location = $location;
                }
                LoadRecordService.prototype.enterNewRecord = function (serverName, cpuLoad, ramLoad) {
                    return this.http({
                        method: "POST",
                        url: "/api/HomeApi/EnterNewRecordLoad",
                        data: {
                            serverName: serverName,
                            cpuLoad: cpuLoad,
                            ramLoad: ramLoad
                        },
                        headers: { 'Content-Type': "application/json" }
                    });
                };
                LoadRecordService.prototype.getLoadData = function (serverName) {
                    return this.http({
                        method: "POST",
                        url: "/api/HomeApi/GetLoadData",
                        data: {
                            serverName: serverName
                        },
                        headers: { 'Content-Type': "application/json" }
                    });
                };
                return LoadRecordService;
            }());
            Services.LoadRecordService = LoadRecordService;
        })(Services = Application.Services || (Application.Services = {}));
    })(Application = Core.Application || (Core.Application = {}));
})(Core || (Core = {}));
//# sourceMappingURL=core-services.js.map