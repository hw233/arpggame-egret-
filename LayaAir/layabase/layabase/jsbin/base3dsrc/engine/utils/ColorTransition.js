var ColorTransition = /** @class */ (function () {
    function ColorTransition() {
        this._canvas = document.createElement("canvas");
        this._cxt = this._canvas.getContext("2d");
        this._gnt = this._cxt.createLinearGradient(0, 0, 128, 0);
        this._canvas.style.zIndex = "1";
        //document.body.appendChild(this._canvas);
    }
    ColorTransition.getInstance = function () {
        if (!this._instance) {
            this._instance = new ColorTransition();
        }
        return this._instance;
    };
    ColorTransition.prototype.getImageData = function ($data) {
        var length = $data.pos.length;
        var color = new Vector3D();
        for (var i = 0; i < length; i++) {
            hexToArgb($data.color[i], false, color);
            this._gnt.addColorStop($data.pos[i] / 255, 'rgba(' + color.x + ',' + color.y + ',' + color.z + ',' + $data.alpha[i] + ')');
        }
        this._cxt.fillStyle = this._gnt;
        this._cxt.fillRect(0, 0, 128, 2);
        return this._cxt.getImageData(0, 0, 128, 2);
    };
    ColorTransition.prototype.getImageDataByVec = function ($data, $lenght) {
        var imgData = this._cxt.createImageData(64, 1);
        var index;
        var baseindex;
        for (var i = 0; i < 64; i++) {
            index = i * 4;
            baseindex = float2int(i / 64 * $lenght) * 4;
            imgData.data[index + 0] = $data[baseindex + 0] * ($data[baseindex + 3] / 0xff);
            imgData.data[index + 1] = $data[baseindex + 1] * ($data[baseindex + 3] / 0xff);
            imgData.data[index + 2] = $data[baseindex + 2] * ($data[baseindex + 3] / 0xff);
            imgData.data[index + 3] = $data[baseindex + 3];
            //imgData.data[index + 3] = 0xff
        }
        return imgData;
        //Scene_data.context3D.getTexture(imgData);
    };
    ColorTransition.prototype.setData = function () {
    };
    return ColorTransition;
}());
//# sourceMappingURL=ColorTransition.js.map