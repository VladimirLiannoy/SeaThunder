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
    this.cannonsContainer.position.y = this.height / 1.5;

    this.healthContainer = new PIXI.Container();
    this.healthContainer.position.x = 15;
    this.healthContainer.position.y = this.height / 3;

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
    this.rootContainer.addChild(this.healthContainer);

    container.addChild(this.rootContainer);


    this.initIndicators = function (ship) {

        me.createCannonIndicators(ship.cannonItems);
        me.createHealthIndicator(ship.health);

        console.log(ship);
    };

    this.createCannonIndicators = function (cannonItems) {
        var rect;

        for (var i = 0; i < cannonItems.length; i++) {
            rect = new PIXI.Graphics();
            rect.position.x = i * 20;
            rect.beginFill('0x33cc33');
            rect.drawRect(0, 0, 10, 10);
            me.cannonsContainer.addChild(rect);
            me.cannonIndicatorsArray.push({
                indicator: rect,
                cannon: cannonItems[i]
            });
        }

    };

    this.createHealthIndicator = function (health) {
        var healthBarRed = new PIXI.Graphics(),
                healthBarGreen = new PIXI.Graphics(),
                number = 100,
                textIndicator = new PIXI.Text(number + '/100', {font: '9px Arial'}, 2),
                backColor = '0xff0000',
                frontColor = '0x33cc33',
                strokeColor = '0x33cc33',
                healthLength = 100;

        healthBarRed.beginFill(backColor);
        healthBarRed.drawRect(90, 15, 100, 12);
        healthBarRed.endFill();

        healthBarRed.lineStyle(1, strokeColor, 1);
        healthBarRed.drawRect(90, 15, 100, 12);

        healthBarGreen.beginFill(frontColor);
        healthBarGreen.drawRect(90, 15, healthLength, 12);
        healthBarGreen.endFill();



        me.healthContainer.addChild(healthBarRed);
        me.healthContainer.addChild(healthBarGreen);
        me.healthContainer.addChild(textIndicator);

        textIndicator.anchor.set(0.5, 0);
        textIndicator.position.x = 140;
        textIndicator.position.y = 15;

        Observer.addListener('healthChanged', function (newHealth) {
            healthLength = newHealth * 100 / health;

            healthBarGreen.clear();
            healthBarGreen.beginFill(frontColor);
            healthBarGreen.drawRect(90, 15, healthLength, 12);
            healthBarGreen.endFill();
            number = parseInt(newHealth * 100 / health);
            textIndicator.text = number + '/100';
            console.log(healthLength);
        });
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

    Observer.addListener('playerShipCreated', me.initIndicators);
    Observer.addListener('cannonFired', me.onCannonFired);
    Observer.addListener('cannonRechargeFinished', me.onCannonRecharged);


}