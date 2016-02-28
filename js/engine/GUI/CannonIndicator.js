function CannonIndicator(params) {
    var me = this;
    CannonIndicator.superclass.constructor.apply(me, params);

    this.backItem = null;

    this.counter = null;

    this.time = 0;
    this.rootContainer = null;
    this.counterContainer = null;

    this.cannonIndicatorsArray = [];
    this.width = 20;
    this.height = 20;

    this.intervalId = null;

    this.myCannon = null;

    this.init = function (container, cannon) {
        me.rootContainer = new PIXI.Container();
        container.addChild(me.rootContainer);

        me.myCannon = cannon;

        me.backItem = new PIXI.Graphics();
        me.counter = new PIXI.Text('', {font: '12px Arial', fill: '0xff0000'});
        me.counter.anchor.set(0.5);
        me.counter.position.x = me.width / 2;
        me.counter.position.y = me.height / 2;

        me.backItem.beginFill('0x33cc33');
        me.backItem.drawRect(0, 0, me.width, me.height);
        me.rootContainer.addChild(me.backItem);
        me.rootContainer.addChild(me.counter);

    };

    this.setPosition = function (x, y) {
        me.rootContainer.position.x = x;
        me.rootContainer.position.y = y;
    };

    this.onCannonFired = function (cannon) {

        if (me.myCannon == cannon) {

            me.backItem.beginFill('0xff0000');
            me.backItem.drawRect(0, 0, me.width, me.height);

            me.time = cannon.rechargeTime / 1000;
            me.counter.text = me.time;

            me.intervalId = setInterval(function () {
                me.time--;
                me.counter.text = me.time;
            }, 1000);
        }
    };

    this.onCannonRecharged = function (cannon) {

        if (me.myCannon == cannon) {

            me.backItem.beginFill('0x33cc33');
            me.backItem.drawRect(0, 0, me.width, me.height);

            clearInterval(me.intervalId);
            me.counter.text = '';
        }
    };

    this.update = function () {
        CannonIndicator.superclass.update.apply(me, params);
    };
}
extend(CannonIndicator, VisualEntity);