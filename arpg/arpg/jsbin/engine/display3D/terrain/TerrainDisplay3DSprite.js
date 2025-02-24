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
var GroundDataMesh = (function () {
    function GroundDataMesh() {
    }
    //处理成可以使用的2幂材质数据源
    GroundDataMesh.prototype.mekeUseTexture = function ($img) {
        var $textureRect = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
        if ($textureRect.width != $img.width || $textureRect.height != $img.height) {
            var $temp = new BitMapData($textureRect.width, $textureRect.height);
            for (var i = 0; i < $temp.width; i++) {
                for (var j = 0; j < $temp.height; j++) {
                    var $v = $img.getRgb(i / $temp.width * $img.width, j / $temp.height * $img.height);
                    $temp.setRgb(i, j, $v);
                }
            }
            //    //console.log("地形信息图调整:注需要编辑器地面设置为2幂")
            return $temp;
        }
        else {
            return $img;
        }
    };
    GroundDataMesh.prototype.calibration = function () {
        this.idBitmap = this.mekeUseTexture(this.idBitmap);
        this.infoBitmap = this.mekeUseTexture(this.infoBitmap);
    };
    GroundDataMesh.meshAllgroundData = function ($byte) {
        var cellNumX = $byte.readInt();
        var cellNumZ = $byte.readInt();
        var $groudItem = new Array();
        for (var i = 0; i < cellNumX; i++) {
            for (var j = 0; j < cellNumZ; j++) {
                var tx = $byte.readInt();
                var ty = $byte.readInt();
                var $tw = $byte.readInt();
                var $th = $byte.readInt();
                var $groundDataMesh = new GroundDataMesh();
                $groundDataMesh.idBitmap = new BitMapData($tw, $th);
                $groundDataMesh.infoBitmap = new BitMapData($tw, $th);
                $groundDataMesh.tx = tx;
                $groundDataMesh.ty = ty;
                $groudItem.push($groundDataMesh);
                for (var k = 0; k < $tw; k++) {
                    for (var h = 0; h < $th; h++) {
                        var $vid;
                        var $indexKey = $byte.readByte();
                        switch ($indexKey) {
                            case 0:
                                $vid = new Vector3D(0, 1, 2);
                                break;
                            case 1:
                                $vid = new Vector3D(0, 1, 3);
                                break;
                            case 2:
                                $vid = new Vector3D(0, 2, 3);
                                break;
                            case 3:
                                $vid = new Vector3D(1, 2, 3);
                                break;
                            default:
                                throw new Error("信息索引没有编入");
                        }
                        $groundDataMesh.idBitmap.setRgb(k, h, new Vector3D($vid.x / 255, $vid.y / 255, $vid.z / 255, 1));
                        var $vinfo = new Vector3D();
                        $vinfo.x = $byte.readByte() + 128;
                        $vinfo.y = $byte.readByte() + 128;
                        $vinfo.z = 255 - $vinfo.x - $vinfo.y;
                        $groundDataMesh.infoBitmap.setRgb(k, h, new Vector3D($vinfo.x / 255, $vinfo.y / 255, $vinfo.z / 255, 1));
                    }
                }
                $groundDataMesh.calibration();
            }
        }
        var $sixUrl = $byte.readUTF();
        for (var $tempidx = 0; $tempidx < $groudItem.length; $tempidx++) {
            $groudItem[$tempidx].sixurl = $sixUrl;
        }
        return $groudItem;
    };
    return GroundDataMesh;
}());
var TerrainDisplay3DSprite = (function (_super) {
    __extends(TerrainDisplay3DSprite, _super);
    function TerrainDisplay3DSprite() {
        var _this = _super.call(this) || this;
        ProgrmaManager.getInstance().registe(TerrainDisplay3DShader.TerrainDisplay3DShader, new TerrainDisplay3DShader());
        _this.groundShader = ProgrmaManager.getInstance().getProgram(TerrainDisplay3DShader.TerrainDisplay3DShader);
        return _this;
    }
    TerrainDisplay3DSprite.prototype.update = function () {
        if (this.groundShader && this.baseSixteenRes && this.idMapPicDataTexture) {
            this.upDataToDraw();
        }
        else {
            _super.prototype.update.call(this);
        }
    };
    TerrainDisplay3DSprite.prototype.upDataToDraw = function () {
        if (this.groundShader && this.baseSixteenRes) {
            Scene_data.context3D.cullFaceBack(false);
            Scene_data.context3D.setProgram(this.groundShader.program);
            Scene_data.context3D.setVcMatrix4fv(this.groundShader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.groundShader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.groundShader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVc4fv(this.groundShader, "colorData", [1, 0, 1, 1]);
            var tf = Scene_data.context3D.pushVa(this.objData.vertexBuffer);
            if (!tf) {
                Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
                Scene_data.context3D.setVaOffset(1, 2, this.objData.stride, this.objData.uvsOffsets);
            }
            Scene_data.context3D.setRenderTexture(this.groundShader, "idmaptexture", this.idMapPicDataTexture, 0);
            Scene_data.context3D.setRenderTexture(this.groundShader, "infotexture", this.infoMapPicDataTexture, 1);
            Scene_data.context3D.setRenderTexture(this.groundShader, "sixtexture", this.baseSixteenRes.texture, 2);
            Scene_data.context3D.setRenderTexture(this.groundShader, "lightexture", this.lightMapTexture, 3);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    TerrainDisplay3DSprite.prototype.setGrounDataMesh = function ($groundDataMesh) {
        var _this = this;
        this.idMapPicDataTexture = Scene_data.context3D.getTexture($groundDataMesh.idBitmap.imgData, 0, 1);
        this.infoMapPicDataTexture = Scene_data.context3D.getTexture($groundDataMesh.infoBitmap.imgData, 0, 1);
        var $textureUrl = $groundDataMesh.sixurl;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $textureUrl, function ($texture) {
            _this.baseSixteenRes = $texture;
        });
    };
    return TerrainDisplay3DSprite;
}(Display3DSprite));
//# sourceMappingURL=TerrainDisplay3DSprite.js.map