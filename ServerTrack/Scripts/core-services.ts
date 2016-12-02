/*
Created by: Jon Russell (jrussell@nodeomega.com)
*/

module Core {
    "use strict";

    // angular app services.
    export module Application.Services {
        export interface ILoadRecordService {
            enterNewRecord(serverName: string, cpuLoad: number, ramLoad: number): any;
            getLoadData(serverName: string): any;
        }

        export class LoadRecordService {
            http: ng.IHttpService;
            location: ng.ILocationService;

            constructor($http: ng.IHttpService, $location: ng.ILocationService) {
                this.http = $http;
                this.location = $location;
            }

            enterNewRecord(serverName: string, cpuLoad: number, ramLoad: number): any {
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
            }

            getLoadData(serverName: string): any {
                return this.http({
                    method: "POST",
                    url: "/api/HomeApi/GetLoadData",
                    data: {
                        serverName: serverName
                    },
                    headers: { 'Content-Type': "application/json" }
                });
            }
        }
    }
}