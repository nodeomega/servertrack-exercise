/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/bootstrap/bootstrap.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angularjs/angular-animate.d.ts" />
/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="typings/moment/moment.d.ts" />
/// <reference path="typings/moment-timezone/moment-timezone.d.ts" />
/// <reference path="common-library.ts" />
/// <reference path="core-controllers.ts" />
var Core;
(function (Core) {
    "use strict";
    // Angular application setup
    Core.appModule = angular.module("serverTrack", ["ngAnimate", "ngSanitize"]);
    // Controllers
    Core.appModule.controller("loadRecordController", [
        "$scope", "$filter", "loadRecordService", function ($scope, $filter, loadRecordService) { return new Core.Application
            .Controllers.LoadRecordController($scope, $filter, loadRecordService); }
    ]);
    // Services
    Core.appModule.factory("loadRecordService", [
        "$http", "$location", function ($http, $location) { return new Core.Application.Services
            .LoadRecordService($http, $location); }
    ]);
})(Core || (Core = {}));
//# sourceMappingURL=core.js.map