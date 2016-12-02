/// <reference path="core-services.ts" />
/// <reference path="core-directives.ts" />
/// <reference path="core.ts" />
var Core;
(function (Core) {
    "use strict";
    // controllers for the AngularJS app.
    var Application;
    (function (Application) {
        var Controllers;
        (function (Controllers) {
            var LoadRecordController = (function () {
                function LoadRecordController($scope, $filter, loadRecordService) {
                    var _this = this;
                    this.scope = $scope;
                    this.filter = $filter;
                    this.loadRecordService = loadRecordService;
                    this.data = [];
                    this.scope.errorMessage = "";
                    this.scope.listingIsLoading = false;
                    this.scope.addingLoadData = false;
                    this.scope.serverNameSearch = "test";
                    this.scope.newLoadEntry = {
                        serverName: "",
                        cpuLoad: 0,
                        ramLoad: 0
                    };
                    this.scope.serverNameEntered = "";
                    this.scope.reportTypeUnit = "Minute";
                    this.scope.recordAverages = [];
                    var activeStyle = { 'background-color': '#fff' };
                    var inactiveStyle = { 'background-color': '#ccc' };
                    this.scope.hourStyle = activeStyle;
                    this.scope.dayStyle = inactiveStyle;
                    this.scope.SwitchToHourReport = (function () {
                        _this.scope.reportTypeUnit = "Minute";
                        _this.scope.hourStyle = activeStyle;
                        _this.scope.dayStyle = inactiveStyle;
                        _this.scope.SearchServerInfo();
                    });
                    this.scope.SwitchToDayReport = (function () {
                        _this.scope.reportTypeUnit = "Hour";
                        _this.scope.hourStyle = inactiveStyle;
                        _this.scope.dayStyle = activeStyle;
                        _this.scope.SearchServerInfo();
                    });
                    this.scope.SearchServerInfo = (function () {
                        _this.scope.GetLoadData(_this.scope.serverNameSearch);
                    });
                    this.scope.AddNewLoad = (function () {
                        _this.scope.EnterNewRecord(_this.scope.newLoadEntry.serverName, _this.scope.newLoadEntry.cpuLoad, _this.scope.newLoadEntry.ramLoad);
                    });
                    this.scope.EnterNewRecord = (function (serverName, cpuLoad, ramLoad) {
                        var that = _this;
                        that.scope.addingLoadData = true;
                        that.loadRecordService
                            .enterNewRecord(serverName, cpuLoad, ramLoad)
                            .then(function (result) {
                            _this.scope.newLoadEntry = {
                                serverName: "",
                                cpuLoad: 0,
                                ramLoad: 0
                            };
                        })
                            .finally(function () {
                            that.scope.addingLoadData = false;
                            that.scope.SearchServerInfo();
                        });
                    });
                    this.scope.GetLoadData = (function (serverName) {
                        var that = _this;
                        that.scope.listingIsLoading = true;
                        that.loadRecordService
                            .getLoadData(serverName)
                            .then(function (result) {
                            if (that.scope.reportTypeUnit === "Minute")
                                that.scope.recordAverages = result.data.HourReport;
                            if (that.scope.reportTypeUnit === "Hour")
                                that.scope.recordAverages = result.data.DayReport;
                        })
                            .finally(function () {
                            that.scope.listingIsLoading = false;
                        });
                    });
                    this.scope.Initialize = (function () {
                        _this.scope.GetLoadData(_this.scope.serverNameSearch);
                    });
                }
                return LoadRecordController;
            }());
            Controllers.LoadRecordController = LoadRecordController;
        })(Controllers = Application.Controllers || (Application.Controllers = {}));
    })(Application = Core.Application || (Core.Application = {}));
})(Core || (Core = {}));
//# sourceMappingURL=core-controllers.js.map