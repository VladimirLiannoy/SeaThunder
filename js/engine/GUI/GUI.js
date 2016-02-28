function GUI() {
    var me = this;

    GUI.superclass.constructor.apply(me, {});

    this.width = 300;
    this.height = 200;

    this.rootContainer = null;
    this.shipImg = null;

    this.layout = {
        ship: {
            x: 0,
            y: 0,
            width: me.width,
            height: me.height / 3
        }

    };

    this.init = function (container, gameConfig) {
        me.rootContainer = new PIXI.Container();
        me.rootContainer.position.y = gameConfig.height - this.height;
        me.initMenu();

        me.shipImg = new PIXI.Sprite.fromImage('images/ship_in_menu.gif');
        me.shipImg.anchor.set(0.5, 0);
        me.shipImg.position.set(this.width / 2, -10);
        //me.shipImg.scale.set(0.7);
        me.shipImg.height = me.layout.ship.height;


        me.rootContainer.addChild(me.shipImg);

        container.addChild(me.rootContainer);

    };


    this.initAllIndicators = function (ship) {


        me.createCannonIndicators(ship.cannonItems);
        me.createHealthIndicator(ship.health);
        //console.log(ship);
    };

    this.initMenu = function () {
        var menu = new Menu(me.width, me.height);
        menu.init(me.rootContainer);

    };

    this.createCannonIndicators = function (cannonItems) {
        var cannonIndicator,
                cannonIndicatorsArray = [];

        for (var i = 0; i < cannonItems.length; i++) {

            cannonIndicator = new CannonIndicator();
            cannonIndicator.init(me.rootContainer, cannonItems[i]);
            cannonIndicator.setPosition(75 + i * 25, 120);
            cannonIndicatorsArray.push(cannonIndicator);

        }

        Observer.addListener('cannonFired', function (cannon) {
            for (var i = 0; i < cannonIndicatorsArray.length; i++) {

                cannonIndicatorsArray[i].onCannonFired(cannon);
            }
        });

        Observer.addListener('cannonRechargeFinished', function (cannon) {
            for (var i = 0; i < cannonIndicatorsArray.length; i++) {

                cannonIndicatorsArray[i].onCannonRecharged(cannon);
            }

            //cannonIndicator.onCannonRecharged(cannon);
        });

        //Observer.addListener('cannonRechargeFinished', me.onCannonRecharged);
    };

    this.createHealthIndicator = function (health) {
        var healthIndicator = new HealthIndicator();

        healthIndicator.init(me.rootContainer, health);
        healthIndicator.setPosition(15, me.height / 3);

        Observer.addListener('healthChanged', function (newHealth) {
            healthIndicator.onHealthChange(newHealth);
        });
    };

    Observer.addListener('playerShipCreated', me.initAllIndicators);

    this.update = function () {
        GUI.superclass.update.apply(me);
    };
}

extend(GUI, VisualEntity);