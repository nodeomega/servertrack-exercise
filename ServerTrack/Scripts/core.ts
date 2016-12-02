/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/bootstrap/bootstrap.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angularjs/angular-animate.d.ts" />
/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="typings/moment/moment.d.ts" />
/// <reference path="typings/moment-timezone/moment-timezone.d.ts" />
/// <reference path="common-library.ts" />
/// <reference path="core-controllers.ts" />


module Core {
    "use strict";

    // Angular application setup
    export var appModule = angular.module("serverTrack", ["ngAnimate", "ngSanitize"]);

    // Controllers
    appModule.controller("loadRecordController",
    [
        "$scope", "$filter", "loadRecordService", ($scope: any, $filter: any, loadRecordService: any) => new Application
        .Controllers.LoadRecordController($scope, $filter, loadRecordService)
        ]);

    // Services
    appModule.factory("loadRecordService",
    [
        "$http", "$location", ($http: any, $location: any) => new Application.Services
        .LoadRecordService($http, $location)
    ]);
}