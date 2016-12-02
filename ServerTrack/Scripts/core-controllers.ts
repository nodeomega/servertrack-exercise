/// <reference path="core-services.ts" />
/// <reference path="core-directives.ts" />
/// <reference path="core.ts" />

module Core {
    "use strict";

    // controllers for the AngularJS app.
    export module Application.Controllers {
        export class LoadRecordController {
            scope: any;
            filter: any;
            loadRecordService: Services.ILoadRecordService;
            data: any;

            constructor($scope: ng.IScope, $filter: ng.IFilterService, loadRecordService: Services.ILoadRecordService) {
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

                this.scope.SwitchToHourReport = (() => {
                    this.scope.reportTypeUnit = "Minute";
                    this.scope.hourStyle = activeStyle;
                    this.scope.dayStyle = inactiveStyle;
                    this.scope.SearchServerInfo();
                });

                this.scope.SwitchToDayReport = (() => {
                    this.scope.reportTypeUnit = "Hour";
                    this.scope.hourStyle = inactiveStyle;
                    this.scope.dayStyle = activeStyle;
                    this.scope.SearchServerInfo();
                });


                this.scope.SearchServerInfo = (() => {
                    this.scope.GetLoadData(this.scope.serverNameSearch);
                });

                this.scope.AddNewLoad = (() => {
                    this.scope.EnterNewRecord(this.scope.newLoadEntry.serverName,
                        this.scope.newLoadEntry.cpuLoad,
                        this.scope.newLoadEntry.ramLoad);
                });

                this.scope.EnterNewRecord = ((serverName: string, cpuLoad: number, ramLoad: number) => {
                    var that = this;
                    that.scope.addingLoadData = true;

                    that.loadRecordService
                        .enterNewRecord(serverName, cpuLoad, ramLoad)
                        .then((result: any) => {
                            this.scope.newLoadEntry = {
                                serverName: "",
                                cpuLoad: 0,
                                ramLoad: 0
                            };
                        })
                        .finally(() => {
                            that.scope.addingLoadData = false;
                            that.scope.SearchServerInfo();
                        });
                });

                this.scope.GetLoadData = ((serverName: string) => {
                    var that = this;
                    that.scope.listingIsLoading = true;

                    that.loadRecordService
                        .getLoadData(serverName)
                        .then((result: any) => {
                            if (that.scope.reportTypeUnit === "Minute")
                                that.scope.recordAverages = result.data.HourReport;
                            if (that.scope.reportTypeUnit === "Hour")
                                that.scope.recordAverages = result.data.DayReport;
                        })
                        .finally(() => {
                            that.scope.listingIsLoading = false;
                        });
                });

                this.scope.Initialize = (() => {
                    this.scope.GetLoadData(this.scope.serverNameSearch);
                });
            }
        }
    }
}