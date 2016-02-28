function Menu(width, height) {
    var me = this;
    Menu.superclass.constructor.apply(me);

    this.rootContainer = null;
    this.backItem = null;

    this.init = function (container, cannonItems) {
        me.rootContainer = new PIXI.Container();
        container.addChild(me.rootContainer);

        me.backItem = new PIXI.Graphics();
        me.backItem.beginFill('0x000000', 0.7);
        me.backItem.drawRect(0, 0, width, height);

        me.rootContainer.addChild(me.backItem);
    };


    this.update = function () {
        Menu.superclass.update.apply(me);
    };
}
extend(Menu, VisualEntity);