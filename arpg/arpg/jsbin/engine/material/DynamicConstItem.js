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
var DynamicConstItem = (function (_super) {
    __extends(DynamicConstItem, _super);
    function DynamicConstItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DynamicConstItem.prototype.update = function (t) {
        if (t === void 0) { t = 0; }
        this.currentValue = this.curve.getValue(t);
        this.target.setDynamic(this);
        //this.target.setDynamicDirect(this.curve.getValue(t),this.targetOffset);
    };
    Object.defineProperty(DynamicConstItem.prototype, "type", {
        set: function (value) {
            this._type = value;
            this.curve = new Curve;
            this.curve.type = value;
        },
        enumerable: true,
        configurable: true
    });
    return DynamicConstItem;
}(DynamicBaseConstItem));
//# sourceMappingURL=DynamicConstItem.js.map