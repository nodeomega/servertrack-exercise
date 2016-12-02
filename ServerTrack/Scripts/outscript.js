var CommonLibrary;
(function (CommonLibrary) {
    // prototypes
    Array.prototype.contains = function (v) {
        for (var i = 0; i < this.length; i++) {
            //if (this[i] === v) return true;
            if (JSON.stringify(this[i]) === JSON.stringify(v))
                return true;
        }
        return false;
    };
    Array.prototype.unique = function () {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };
    // string literals
    // - error icon
    CommonLibrary.errorIcon = '<span class="fa fa-exclamation-triangle error"></span>';
    // - checkmark for success icon
    CommonLibrary.successIcon = '<span class="fa fa-check-circle action-successful"></span>';
    // - coffee icon, because who doesn't need coffee?
    CommonLibrary.coffeeIcon = '<span class="fa fa-coffee coffee"></span>';
    // - moment string format for date/times.
    CommonLibrary.momentFormat = "MM/DD/YYYY HH:mm";
    // TextLabel class.
    var TextLabel = (function () {
        function TextLabel(name) {
            var self = this;
            self.name = name;
            self.value = name.replace(/\s/g, '');
        }
        return TextLabel;
    }());
    CommonLibrary.TextLabel = TextLabel;
    // creates a list of textlabels
    function CreateTextLabelList(names) {
        return names.map(function (name) { return new TextLabel(name); });
    }
    CommonLibrary.CreateTextLabelList = CreateTextLabelList;
    // Checks whether a value is within a numerical range, inclusive.
    function IsInRange(value, min, max) {
        // If either min or max is null/undefined, or if min is greater than max, or if the value is 
        // not a number, it is not in range.
        if ((IsNullOrUndefined(min) || IsNullOrUndefined(max)) || (min > max) || isNaN(value)) {
            return false;
        }
        // parse the integer value.
        var intVal = parseInt(value);
        // returns true if the value as an integer is within the range, false otherwise.
        return ((intVal >= min) === (intVal <= max));
    }
    CommonLibrary.IsInRange = IsInRange;
    // checks whether a given value is null or undefined.
    function IsNullOrUndefined(val) {
        return (typeof val === 'undefined' || val === null);
    }
    CommonLibrary.IsNullOrUndefined = IsNullOrUndefined;
    function RandomInteger(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
    CommonLibrary.RandomInteger = RandomInteger;
    function ConvertSecondsToHoursMinutesSeconds(inSeconds) {
        var date = new Date(null);
        date.setSeconds(inSeconds);
        return date.toISOString().substr(11, 8);
        //var outSeconds = inSeconds % 60;
        //var outMinutes = Math.floor(inSeconds / 60) % 60;
        //var outHours = Math.floor(inSeconds / 3600)
        //return outHours + ":" + outMinutes + ":" + outSeconds;
    }
    CommonLibrary.ConvertSecondsToHoursMinutesSeconds = ConvertSecondsToHoursMinutesSeconds;
})(CommonLibrary || (CommonLibrary = {}));

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

/*
Created by: Jon Russell (jrussell@nodeomega.com)
*/
var Core;
(function (Core) {
    "use strict";
})(Core || (Core = {}));

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi1saWJyYXJ5LnRzIiwiY29yZS1jb250cm9sbGVycy50cyIsImNvcmUtZGlyZWN0aXZlcy50cyIsImNvcmUtc2VydmljZXMudHMiLCJjb3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLElBQU8sYUFBYSxDQW1GbkI7QUFuRkQsV0FBTyxhQUFhLEVBQUMsQ0FBQztJQUNsQixhQUFhO0lBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLGlDQUFpQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNuRSxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDLENBQUM7SUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRztRQUNyQixJQUFJLEdBQUcsR0FBUSxFQUFFLENBQUM7UUFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDLENB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bUJWO0FBbkJELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFDVCxZQUFZLENBQUM7SUFFYiw0QkFBNEI7SUFDakIsY0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFFbEYsY0FBYztJQUNkLGNBQVMsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQzNDO1FBQ0ksUUFBUSxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxVQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsaUJBQXNCLElBQUssT0FBQSxJQUFJLGdCQUFXO2FBQy9HLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixDQUFDLEVBRDRCLENBQzVCO0tBQ3BFLENBQUMsQ0FBQztJQUVQLFdBQVc7SUFDWCxjQUFTLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUNyQztRQUNJLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBQyxLQUFVLEVBQUUsU0FBYyxJQUFLLE9BQUEsSUFBSSxnQkFBVyxDQUFDLFFBQVE7YUFDN0UsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQURrQixDQUNsQjtLQUN2QyxDQUFDLENBQUM7QUFDUCxDQUFDLEVBbkJNLElBQUksS0FBSixJQUFJLFFBbUJWIiwiZmlsZSI6Im91dHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBBcnJheTxUPiB7XHJcbiAgICBjb250YWlucyh2OiBhbnkpOiBhbnk7XHJcbiAgICB1bmlxdWUoKTogYW55O1xyXG59XHJcblxyXG5tb2R1bGUgQ29tbW9uTGlicmFyeSB7XHJcbiAgICAvLyBwcm90b3R5cGVzXHJcbiAgICBBcnJheS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvL2lmICh0aGlzW2ldID09PSB2KSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHRoaXNbaV0pID09PSBKU09OLnN0cmluZ2lmeSh2KSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgQXJyYXkucHJvdG90eXBlLnVuaXF1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyOiBhbnkgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFhcnIuY29udGFpbnModGhpc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHRoaXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RyaW5nIGxpdGVyYWxzXHJcbiAgICAvLyAtIGVycm9yIGljb25cclxuICAgIGV4cG9ydCB2YXIgZXJyb3JJY29uOiBzdHJpbmcgPSAnPHNwYW4gY2xhc3M9XCJmYSBmYS1leGNsYW1hdGlvbi10cmlhbmdsZSBlcnJvclwiPjwvc3Bhbj4nO1xyXG5cclxuICAgIC8vIC0gY2hlY2ttYXJrIGZvciBzdWNjZXNzIGljb25cclxuICAgIGV4cG9ydCB2YXIgc3VjY2Vzc0ljb246IHN0cmluZyA9ICc8c3BhbiBjbGFzcz1cImZhIGZhLWNoZWNrLWNpcmNsZSBhY3Rpb24tc3VjY2Vzc2Z1bFwiPjwvc3Bhbj4nO1xyXG5cclxuICAgIC8vIC0gY29mZmVlIGljb24sIGJlY2F1c2Ugd2hvIGRvZXNuJ3QgbmVlZCBjb2ZmZWU/XHJcbiAgICBleHBvcnQgdmFyIGNvZmZlZUljb246IHN0cmluZyA9ICc8c3BhbiBjbGFzcz1cImZhIGZhLWNvZmZlZSBjb2ZmZWVcIj48L3NwYW4+JztcclxuXHJcbiAgICAvLyAtIG1vbWVudCBzdHJpbmcgZm9ybWF0IGZvciBkYXRlL3RpbWVzLlxyXG4gICAgZXhwb3J0IHZhciBtb21lbnRGb3JtYXQ6IHN0cmluZyA9IFwiTU0vREQvWVlZWSBISDptbVwiO1xyXG5cclxuICAgIC8vIFRleHRMYWJlbCBjbGFzcy5cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0TGFiZWwge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHNlbGYubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuYW1lLnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNyZWF0ZXMgYSBsaXN0IG9mIHRleHRsYWJlbHNcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBDcmVhdGVUZXh0TGFiZWxMaXN0KG5hbWVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lcy5tYXAoKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBUZXh0TGFiZWwobmFtZSk7IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgd2l0aGluIGEgbnVtZXJpY2FsIHJhbmdlLCBpbmNsdXNpdmUuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gSXNJblJhbmdlKHZhbHVlOiBhbnksIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgICAgIC8vIElmIGVpdGhlciBtaW4gb3IgbWF4IGlzIG51bGwvdW5kZWZpbmVkLCBvciBpZiBtaW4gaXMgZ3JlYXRlciB0aGFuIG1heCwgb3IgaWYgdGhlIHZhbHVlIGlzIFxyXG4gICAgICAgIC8vIG5vdCBhIG51bWJlciwgaXQgaXMgbm90IGluIHJhbmdlLlxyXG4gICAgICAgIGlmICgoSXNOdWxsT3JVbmRlZmluZWQobWluKSB8fCBJc051bGxPclVuZGVmaW5lZChtYXgpKSB8fCAobWluID4gbWF4KSB8fCBpc05hTih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGFyc2UgdGhlIGludGVnZXIgdmFsdWUuXHJcbiAgICAgICAgdmFyIGludFZhbDogYW55ID0gcGFyc2VJbnQodmFsdWUpO1xyXG5cclxuICAgICAgICAvLyByZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGFzIGFuIGludGVnZXIgaXMgd2l0aGluIHRoZSByYW5nZSwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAgICAgIHJldHVybiAoKGludFZhbCA+PSBtaW4pID09PSAoaW50VmFsIDw9IG1heCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gSXNOdWxsT3JVbmRlZmluZWQodmFsOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnIHx8IHZhbCA9PT0gbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIFJhbmRvbUludGVnZXIobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBtYXgpICsgbWluKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gQ29udmVydFNlY29uZHNUb0hvdXJzTWludXRlc1NlY29uZHMoaW5TZWNvbmRzOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKG51bGwpO1xyXG4gICAgICAgIGRhdGUuc2V0U2Vjb25kcyhpblNlY29uZHMpO1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCkuc3Vic3RyKDExLCA4KTtcclxuXHJcbiAgICAgICAgLy92YXIgb3V0U2Vjb25kcyA9IGluU2Vjb25kcyAlIDYwO1xyXG4gICAgICAgIC8vdmFyIG91dE1pbnV0ZXMgPSBNYXRoLmZsb29yKGluU2Vjb25kcyAvIDYwKSAlIDYwO1xyXG4gICAgICAgIC8vdmFyIG91dEhvdXJzID0gTWF0aC5mbG9vcihpblNlY29uZHMgLyAzNjAwKVxyXG4gICAgICAgIC8vcmV0dXJuIG91dEhvdXJzICsgXCI6XCIgKyBvdXRNaW51dGVzICsgXCI6XCIgKyBvdXRTZWNvbmRzO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvcmUtc2VydmljZXMudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29yZS1kaXJlY3RpdmVzLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvcmUudHNcIiAvPlxyXG5cclxubW9kdWxlIENvcmUge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gY29udHJvbGxlcnMgZm9yIHRoZSBBbmd1bGFySlMgYXBwLlxyXG4gICAgZXhwb3J0IG1vZHVsZSBBcHBsaWNhdGlvbi5Db250cm9sbGVycyB7XHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIExvYWRSZWNvcmRDb250cm9sbGVyIHtcclxuICAgICAgICAgICAgc2NvcGU6IGFueTtcclxuICAgICAgICAgICAgZmlsdGVyOiBhbnk7XHJcbiAgICAgICAgICAgIGxvYWRSZWNvcmRTZXJ2aWNlOiBTZXJ2aWNlcy5JTG9hZFJlY29yZFNlcnZpY2U7XHJcbiAgICAgICAgICAgIGRhdGE6IGFueTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKCRzY29wZTogbmcuSVNjb3BlLCAkZmlsdGVyOiBuZy5JRmlsdGVyU2VydmljZSwgbG9hZFJlY29yZFNlcnZpY2U6IFNlcnZpY2VzLklMb2FkUmVjb3JkU2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZSA9ICRzY29wZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gJGZpbHRlcjtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFJlY29yZFNlcnZpY2UgPSBsb2FkUmVjb3JkU2VydmljZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmVycm9yTWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmxpc3RpbmdJc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUuYWRkaW5nTG9hZERhdGEgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLnNlcnZlck5hbWVTZWFyY2ggPSBcInRlc3RcIjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLm5ld0xvYWRFbnRyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNwdUxvYWQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFtTG9hZDogMFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLnNlcnZlck5hbWVFbnRlcmVkID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUucmVwb3J0VHlwZVVuaXQgPSBcIk1pbnV0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS5yZWNvcmRBdmVyYWdlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVTdHlsZSA9IHsgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZicgfTtcclxuICAgICAgICAgICAgICAgIHZhciBpbmFjdGl2ZVN0eWxlID0geyAnYmFja2dyb3VuZC1jb2xvcic6ICcjY2NjJyB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUuaG91clN0eWxlID0gYWN0aXZlU3R5bGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmRheVN0eWxlID0gaW5hY3RpdmVTdHlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLlN3aXRjaFRvSG91clJlcG9ydCA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29wZS5yZXBvcnRUeXBlVW5pdCA9IFwiTWludXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29wZS5ob3VyU3R5bGUgPSBhY3RpdmVTdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmRheVN0eWxlID0gaW5hY3RpdmVTdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLlNlYXJjaFNlcnZlckluZm8oKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUuU3dpdGNoVG9EYXlSZXBvcnQgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUucmVwb3J0VHlwZVVuaXQgPSBcIkhvdXJcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmhvdXJTdHlsZSA9IGluYWN0aXZlU3R5bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29wZS5kYXlTdHlsZSA9IGFjdGl2ZVN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUuU2VhcmNoU2VydmVySW5mbygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUuU2VhcmNoU2VydmVySW5mbyA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29wZS5HZXRMb2FkRGF0YSh0aGlzLnNjb3BlLnNlcnZlck5hbWVTZWFyY2gpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS5BZGROZXdMb2FkID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLkVudGVyTmV3UmVjb3JkKHRoaXMuc2NvcGUubmV3TG9hZEVudHJ5LnNlcnZlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUubmV3TG9hZEVudHJ5LmNwdUxvYWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUubmV3TG9hZEVudHJ5LnJhbUxvYWQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS5FbnRlck5ld1JlY29yZCA9ICgoc2VydmVyTmFtZTogc3RyaW5nLCBjcHVMb2FkOiBudW1iZXIsIHJhbUxvYWQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNjb3BlLmFkZGluZ0xvYWREYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2FkUmVjb3JkU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW50ZXJOZXdSZWNvcmQoc2VydmVyTmFtZSwgY3B1TG9hZCwgcmFtTG9hZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLm5ld0xvYWRFbnRyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwdUxvYWQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFtTG9hZDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zY29wZS5hZGRpbmdMb2FkRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zY29wZS5TZWFyY2hTZXJ2ZXJJbmZvKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS5HZXRMb2FkRGF0YSA9ICgoc2VydmVyTmFtZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2NvcGUubGlzdGluZ0lzTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9hZFJlY29yZFNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldExvYWREYXRhKHNlcnZlck5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuc2NvcGUucmVwb3J0VHlwZVVuaXQgPT09IFwiTWludXRlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zY29wZS5yZWNvcmRBdmVyYWdlcyA9IHJlc3VsdC5kYXRhLkhvdXJSZXBvcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5zY29wZS5yZXBvcnRUeXBlVW5pdCA9PT0gXCJIb3VyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zY29wZS5yZWNvcmRBdmVyYWdlcyA9IHJlc3VsdC5kYXRhLkRheVJlcG9ydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zY29wZS5saXN0aW5nSXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS5Jbml0aWFsaXplID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLkdldExvYWREYXRhKHRoaXMuc2NvcGUuc2VydmVyTmFtZVNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qXHJcbkNyZWF0ZWQgYnk6IEpvbiBSdXNzZWxsIChqcnVzc2VsbEBub2Rlb21lZ2EuY29tKVxyXG4qL1xyXG5cclxubW9kdWxlIENvcmUge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gYW5ndWxhciBhcHAgZGlyZWN0aXZlcy5cclxuICAgIGV4cG9ydCBtb2R1bGUgQXBwbGljYXRpb24uRGlyZWN0aXZlcyB7XHJcblxyXG4gICAgfVxyXG59IiwiLypcclxuQ3JlYXRlZCBieTogSm9uIFJ1c3NlbGwgKGpydXNzZWxsQG5vZGVvbWVnYS5jb20pXHJcbiovXHJcblxyXG5tb2R1bGUgQ29yZSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBhbmd1bGFyIGFwcCBzZXJ2aWNlcy5cclxuICAgIGV4cG9ydCBtb2R1bGUgQXBwbGljYXRpb24uU2VydmljZXMge1xyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxvYWRSZWNvcmRTZXJ2aWNlIHtcclxuICAgICAgICAgICAgZW50ZXJOZXdSZWNvcmQoc2VydmVyTmFtZTogc3RyaW5nLCBjcHVMb2FkOiBudW1iZXIsIHJhbUxvYWQ6IG51bWJlcik6IGFueTtcclxuICAgICAgICAgICAgZ2V0TG9hZERhdGEoc2VydmVyTmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIExvYWRSZWNvcmRTZXJ2aWNlIHtcclxuICAgICAgICAgICAgaHR0cDogbmcuSUh0dHBTZXJ2aWNlO1xyXG4gICAgICAgICAgICBsb2NhdGlvbjogbmcuSUxvY2F0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKCRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRsb2NhdGlvbjogbmcuSUxvY2F0aW9uU2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwID0gJGh0dHA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uID0gJGxvY2F0aW9uO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbnRlck5ld1JlY29yZChzZXJ2ZXJOYW1lOiBzdHJpbmcsIGNwdUxvYWQ6IG51bWJlciwgcmFtTG9hZDogbnVtYmVyKTogYW55IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvSG9tZUFwaS9FbnRlck5ld1JlY29yZExvYWRcIixcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlck5hbWU6IHNlcnZlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNwdUxvYWQ6IGNwdUxvYWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbUxvYWQ6IHJhbUxvYWRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6IFwiYXBwbGljYXRpb24vanNvblwiIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBnZXRMb2FkRGF0YShzZXJ2ZXJOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS9Ib21lQXBpL0dldExvYWREYXRhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJOYW1lOiBzZXJ2ZXJOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL2pxdWVyeS9qcXVlcnkuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL2Jvb3RzdHJhcC9ib290c3RyYXAuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL2FuZ3VsYXJqcy9hbmd1bGFyLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9hbmd1bGFyanMvYW5ndWxhci1hbmltYXRlLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9hbmd1bGFyLXVpLWJvb3RzdHJhcC9hbmd1bGFyLXVpLWJvb3RzdHJhcC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvbW9tZW50L21vbWVudC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvbW9tZW50LXRpbWV6b25lL21vbWVudC10aW1lem9uZS5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbW1vbi1saWJyYXJ5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvcmUtY29udHJvbGxlcnMudHNcIiAvPlxyXG5cclxuXHJcbm1vZHVsZSBDb3JlIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEFuZ3VsYXIgYXBwbGljYXRpb24gc2V0dXBcclxuICAgIGV4cG9ydCB2YXIgYXBwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoXCJzZXJ2ZXJUcmFja1wiLCBbXCJuZ0FuaW1hdGVcIiwgXCJuZ1Nhbml0aXplXCJdKTtcclxuXHJcbiAgICAvLyBDb250cm9sbGVyc1xyXG4gICAgYXBwTW9kdWxlLmNvbnRyb2xsZXIoXCJsb2FkUmVjb3JkQ29udHJvbGxlclwiLFxyXG4gICAgW1xyXG4gICAgICAgIFwiJHNjb3BlXCIsIFwiJGZpbHRlclwiLCBcImxvYWRSZWNvcmRTZXJ2aWNlXCIsICgkc2NvcGU6IGFueSwgJGZpbHRlcjogYW55LCBsb2FkUmVjb3JkU2VydmljZTogYW55KSA9PiBuZXcgQXBwbGljYXRpb25cclxuICAgICAgICAuQ29udHJvbGxlcnMuTG9hZFJlY29yZENvbnRyb2xsZXIoJHNjb3BlLCAkZmlsdGVyLCBsb2FkUmVjb3JkU2VydmljZSlcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAvLyBTZXJ2aWNlc1xyXG4gICAgYXBwTW9kdWxlLmZhY3RvcnkoXCJsb2FkUmVjb3JkU2VydmljZVwiLFxyXG4gICAgW1xyXG4gICAgICAgIFwiJGh0dHBcIiwgXCIkbG9jYXRpb25cIiwgKCRodHRwOiBhbnksICRsb2NhdGlvbjogYW55KSA9PiBuZXcgQXBwbGljYXRpb24uU2VydmljZXNcclxuICAgICAgICAuTG9hZFJlY29yZFNlcnZpY2UoJGh0dHAsICRsb2NhdGlvbilcclxuICAgIF0pO1xyXG59Il19
