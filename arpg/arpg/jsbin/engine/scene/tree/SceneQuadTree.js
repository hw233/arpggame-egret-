var SceneQuadTree = (function () {
    function SceneQuadTree() {
        this.needUpdata = false;
        this.panleAry = new Array;
    }
    SceneQuadTree.prototype.init = function (obj, $dic) {
        this._circle = new Circle(10000, 10000);
        this._sceneDic = $dic;
        this._rootNode = this.getNode(obj);
        this._ray = new Ray;
    };
    SceneQuadTree.prototype.getNode = function (obj) {
        var quadNode = new QuadTreeNode(obj.x, obj.y, obj.z, obj.width, obj.height, obj.depth);
        if (obj.data) {
            if (!quadNode.sun) {
                quadNode.sun = new Array;
            }
            for (var i = 0; i < obj.data.length; i++) {
                var dataNode = new QuadTreeNode(obj.data[i].x, obj.data[i].y, obj.data[i].z, obj.data[i].width, obj.data[i].height, obj.data[i].depth);
                var key;
                if (obj.data[i].type == 1) {
                    key = "build" + obj.data[i].id;
                }
                else if (obj.data[i].type == 11) {
                    key = "particle" + obj.data[i].id;
                }
                else if (obj.data[i].type == 14) {
                    key = "ground" + obj.data[i].id;
                }
                dataNode.target = this._sceneDic[key];
                dataNode.target.aabb = dataNode;
                quadNode.sun.push(dataNode);
            }
        }
        if (obj.sun) {
            if (!quadNode.sun) {
                quadNode.sun = new Array;
            }
            for (var i = 0; i < obj.sun.length; i++) {
                quadNode.sun.push(this.getNode(obj.sun[i]));
            }
        }
        return quadNode;
    };
    SceneQuadTree.prototype.setCircle = function ($x, $z, $radius) {
        var xx = $x - this._circle.x;
        var yy = $z - this._circle.y;
        if (Math.sqrt(xx * xx + yy * yy) < 10) {
            this.needUpdata = false;
        }
        else {
            this._circle.setData($x, $z, $radius);
            this.needUpdata = true;
        }
    };
    SceneQuadTree.prototype.update = function () {
        MathClass.GetViewHitBoxDataCopy(Scene_data.cam3D.distance);
        var cam = new Vector3D(Scene_data.cam3D.x, Scene_data.cam3D.y, Scene_data.cam3D.z);
        var vc = MathClass.viewBoxVecItem;
        this.panleAry.length = 0;
        this.panleAry.push(this.getPanelByVec(cam, vc[0], vc[1]));
        this.panleAry.push(this.getPanelByVec(cam, vc[1], vc[2]));
        this.panleAry.push(this.getPanelByVec(cam, vc[2], vc[3]));
        this.panleAry.push(this.getPanelByVec(cam, vc[3], vc[0]));
        //this.panleAry.push(this.getPanelByVec(vc[0], vc[1], vc[2]));
        //this._rootNode.testCircle(this._circle);
        //this._rootNode.testCam();
        this._ray.setPos(Scene_data.cam3D.x, Scene_data.cam3D.y, Scene_data.cam3D.z);
        this._ray.setTarget(Scene_data.focus3D.x, Scene_data.focus3D.y, Scene_data.focus3D.z);
        this._ray.baseT = Scene_data.cam3D.distance;
        this._rootNode.testViewFrustum(this.panleAry, this._ray);
    };
    SceneQuadTree.prototype.getPanelByVec = function (v1, v2, v3) {
        var a1 = v2.subtract(v1);
        var a2 = v3.subtract(v1);
        a1 = a1.cross(a2);
        a1.normalize();
        a1.w = -a1.dot(v1);
        return a1;
    };
    SceneQuadTree.prototype.updateDraw = function () {
        if (this.capsuleLineSprite) {
            this.capsuleLineSprite.x = Scene_data.focus3D.x;
            this.capsuleLineSprite.y = Scene_data.focus3D.y + 50;
            this.capsuleLineSprite.z = Scene_data.focus3D.z;
            this.capsuleLineSprite.update();
        }
        else {
            this.capsuleLineSprite = new LineDisplaySprite();
            this.capsuleLineSprite.clear();
            this.capsuleLineSprite.baseColor = new Vector3D(1, 0, 0, 1);
            this.drawCylinder(this._circle.radius, 10);
            this.capsuleLineSprite.upToGpu();
        }
    };
    SceneQuadTree.prototype.drawCylinder = function ($w, $h) {
        var w = $w;
        var h = $h;
        var jindu = 12;
        var lastA;
        var lastB;
        var i;
        for (i = 0; i < jindu; i++) {
            var a = new Vector3D(w, 0, 0);
            var b = new Vector3D(w, +h, 0);
            var m = new Matrix3D;
            m.appendRotation(i * (360 / jindu), Vector3D.Y_AXIS);
            var A = m.transformVector(a);
            var B = m.transformVector(b);
            this.capsuleLineSprite.makeLineMode(A, B);
            //this.capsuleLineSprite.makeLineMode(A, new Vector3D(0, 0, 0))
            this.capsuleLineSprite.makeLineMode(B, new Vector3D(0, +h, 0));
            if (i == (jindu - 1)) {
                this.capsuleLineSprite.makeLineMode(A, a);
                this.capsuleLineSprite.makeLineMode(B, b);
            }
            if (lastA || lastB) {
                this.capsuleLineSprite.makeLineMode(A, lastA);
                this.capsuleLineSprite.makeLineMode(B, lastB);
            }
            lastA = A.clone();
            lastB = B.clone();
        }
    };
    return SceneQuadTree;
}());
//# sourceMappingURL=SceneQuadTree.js.map