/**
 * Created by treem on 2/22/16.
 */

function Entity(params) {
    this.children = [];
    this.parent = null;
}

Entity.prototype.update = function () {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].update();
    }
};

Entity.prototype.addChild = function (child) {
    this.children.push(child);
};

Entity.prototype.removeChild = function (child) {
    var index = this.children.indexOf(child);
    if (index != -1) {
        this.children.splice(index, 1);
    }
};