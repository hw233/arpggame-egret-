var GameVersion = (function () {
    function GameVersion() {
    }
    GameVersion.init = function (str) {
        var ary = str.split("\n");
        for (var i = 0; i < ary.length; i++) {
            var itemAry = ary[i].split("\t");
            if (itemAry.length == 2) {
                this._dic[itemAry[0]] = itemAry[1];
            }
        }
    };
    GameVersion.getVersion = function (key) {
        return this._dic[key];
    };
    return GameVersion;
}());
GameVersion._dic = new Object;
//# sourceMappingURL=gameversion.js.map