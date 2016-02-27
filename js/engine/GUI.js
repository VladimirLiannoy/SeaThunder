function GUI(container, gameConfig) {
    var me = this;
    this.cannonIndicatorsArray = [];

    this.width = 300;
    this.height = 200;

    this.rootContainer = new PIXI.Container();
    this.rootContainer.position.y = gameConfig.height - this.height;

    this.cannonsContainer = new PIXI.Container();
    //this.cannonsContainer.anchor.set(0.5, 0.5);
    this.cannonsContainer.position.x = 15;
    this.cannonsContainer.position.y = this.height / 2;


    this.backItem = new PIXI.Graphics();
    this.backItem.beginFill('0x000000', 0.7);
    this.backItem.drawRect(0, 0, this.width, this.height);


    this.shipImg = new PIXI.Sprite.fromImage('images/ship_in_menu.gif');
    this.shipImg.anchor.set(0.5, 0);
    this.shipImg.position.set(this.width / 2, -10);
    this.shipImg.scale.set(0.7);

    this.rootContainer.addChild(this.backItem);
    this.rootContainer.addChild(this.shipImg);
    this.rootContainer.addChild(this.cannonsContainer);

    container.addChild(this.rootContainer);




    this.initCannons = function (ship) {
        var rect;
        console.log(ship);

        for (var i = 0; i < ship.cannonItems.length; i++) {
            rect = new PIXI.Graphics();
            rect.position.x = i * 20;
            rect.beginFill('0x33cc33');
            rect.drawRect(0, 0, 10, 10);
            me.cannonsContainer.addChild(rect);
            me.cannonIndicatorsArray.push({
                indicator: rect,
                cannon: ship.cannonItems[i]
            });
        }

    };

    this.onCannonFired = function (cannon) {
        var indicatorItem;
        for (var i = 0; i < me.cannonIndicatorsArray.length; i++) {
            indicatorItem = me.cannonIndicatorsArray[i];

            if (indicatorItem.cannon == cannon) {
                indicatorItem.indicator.beginFill('0xff0000');
                indicatorItem.indicator.drawRect(0, 0, 10, 10);
            }
        }
    };

    this.onCannonRecharged = function (cannon) {
        var indicatorItem;
        for (var i = 0; i < me.cannonIndicatorsArray.length; i++) {
            indicatorItem = me.cannonIndicatorsArray[i];

            if (indicatorItem.cannon == cannon) {
                indicatorItem.indicator.beginFill('0x33cc33');
                indicatorItem.indicator.drawRect(0, 0, 10, 10);
            }
        }


    };

    Observer.addListener('playerShipCreated', me.initCannons);
    Observer.addListener('cannonFired', me.onCannonFired);
    Observer.addListener('cannonRechargeFinished', me.onCannonRecharged);


}