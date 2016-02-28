function HealthIndicator(params) {
    var me = this;
    HealthIndicator.superclass.constructor.apply(me, params);

    var number = 100,
            backColor = '0xff0000',
            frontColor = '0x33cc33',
            strokeColor = '0x33cc33',
            healthLength = 100;

    this.rootContainer = null;
    this.healthBarRed = null;
    this.healthBarGreen = null;
    this.textIndicator = null;
    this.maxHealth = 0;


    this.init = function (container, maxHealth) {

        me.rootContainer = new PIXI.Container();
        container.addChild(me.rootContainer);
        
        me.maxHealth = maxHealth;

        me.healthBarRed = new PIXI.Graphics();
        me.healthBarGreen = new PIXI.Graphics();
        me.textIndicator = new PIXI.Text(number + '/100', {font: '9px Arial'}, 2);


        me.healthBarRed.beginFill(backColor);
        me.healthBarRed.drawRect(90, 15, 100, 12);
        me.healthBarRed.endFill();

        me.healthBarRed.lineStyle(1, strokeColor, 1);
        me.healthBarRed.drawRect(90, 15, 100, 12);

        me.healthBarGreen.beginFill(frontColor);
        me.healthBarGreen.drawRect(90, 15, healthLength, 12);
        me.healthBarGreen.endFill();



        me.rootContainer.addChild(me.healthBarRed);
        me.rootContainer.addChild(me.healthBarGreen);
        me.rootContainer.addChild(me.textIndicator);

        me.textIndicator.anchor.set(0.5, 0);
        me.textIndicator.position.x = 140;
        me.textIndicator.position.y = 15;


    };

    this.setPosition = function (x, y) {
        me.rootContainer.position.x = x;
        me.rootContainer.position.y = y;
    };

    this.onHealthChange = function (newHealth) {

        healthLength = newHealth * 100 / me.maxHealth;

        me.healthBarGreen.clear();
        me.healthBarGreen.beginFill(frontColor);
        me.healthBarGreen.drawRect(90, 15, healthLength, 12);
        me.healthBarGreen.endFill();
        number = parseInt(newHealth * 100 / me.maxHealth);
        me.textIndicator.text = number + '/100';
        console.log(healthLength);
    };


    this.update = function () {
        HealthIndicator.superclass.update.apply(me, params);
    };


}




extend(HealthIndicator, VisualEntity);