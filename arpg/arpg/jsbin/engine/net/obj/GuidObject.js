var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GuidObject = (function (_super) {
    __extends(GuidObject, _super);
    function GuidObject(g) {
        if (g === void 0) { g = ""; }
        var _this = _super.call(this) || this;
        //引用计数
        _this._ref = 0;
        _this.guid = g;
        return _this;
    }
    /**
        * 增加引用计数
        * @param r 计数变量,1/-1
        */
    GuidObject.prototype.add_ref = function (r) {
        this._ref = this._ref + r;
    };
    Object.defineProperty(GuidObject.prototype, "ref", {
        /**
            * 当引用计数小于等于0的时候就可以从对象表中被释放了
            */
        get: function () {
            return this._ref;
        },
        enumerable: true,
        configurable: true
    });
    GuidObject.prototype.getName = function () {
        return this.GetStr(SharedDef.BINLOG_STRING_FIELD_NAME);
    };
    GuidObject.prototype.getGuid = function () {
        return this.GetStr(SharedDef.BINLOG_STRING_FIELD_GUID);
    };
    return GuidObject;
}(SyncEventRecorder));
//# sourceMappingURL=GuidObject.js.map