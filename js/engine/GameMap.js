function GameMap(params) {
    var me = this;

    GameMap.superclass.constructor.apply(me, params);

    this.stage = null;
    this.gameConfig = null;


    this.init = function (container) {
        me.stage = new PIXI.Container();
        container.addChild(me.stage);

        me.gameConfig = Service('GAMECONFIG');

        var seatTileTexture = PIXI.Texture.fromImage('images/sea-mapx.jpg');
        var tilingSprite = new PIXI.extras.TilingSprite(seatTileTexture, me.gameConfig.gameField.width, me.gameConfig.gameField.height);
        me.stage.addChild(tilingSprite);

        me.initEventListeners();

    };

    this.getShipsContainer = function () {
      return me.stage;
    };

    this.correctStage = function () {
        
        if (me.stage.position.x > 0) {
            me.stage.position.x = 0;
        }

        if (me.stage.position.x < -me.gameConfig.gameField.width * me.gameConfig.scale + me.gameConfig.width) {
            me.stage.position.x = -me.gameConfig.gameField.width * me.gameConfig.scale + me.gameConfig.width;
        }

        if (me.stage.position.y > 0) {
            me.stage.position.y = 0;
        }

        if (me.stage.position.y < -me.gameConfig.gameField.height * me.gameConfig.scale + me.gameConfig.height) {
            me.stage.position.y = -me.gameConfig.gameField.height * me.gameConfig.scale + me.gameConfig.height;
        }
    };

    this.setTargetPosition = function (mouseX, mouseY) {
        var x = (mouseX - me.stage.position.x) / me.gameConfig.scale,
            y = (mouseY - me.stage.position.y) / me.gameConfig.scale;

        Observer.fireEvent('setPointerPos', {x: x, y:y});
    };

    this.initEventListeners = function () {
        var stage = me.stage,
            rendererView = Service('renderer').view;

        rendererView.addEventListener('mousemove', function (event) {

            if (me.gameConfig.mapDrag.state) {
                stage.position.x += event.offsetX - me.gameConfig.mapDrag.x;
                stage.position.y += event.offsetY - me.gameConfig.mapDrag.y;
                me.gameConfig.mapDrag.x = event.offsetX;
                me.gameConfig.mapDrag.y = event.offsetY;

                me.correctStage();

            } else {
                me.setTargetPosition(event.offsetX, event.offsetY);
            }

        });

        rendererView.addEventListener('mousedown', function (event) {

            if (event.which == 3) {

                Observer.fireEvent('playerTryFire');
            }

            if (event.which == 1) {
                me.gameConfig.mapDrag.state = true;
                me.gameConfig.mapDrag.x = event.offsetX;
                me.gameConfig.mapDrag.y = event.offsetY;

            }

            //console.log(event);
        });

        window.addEventListener("contextmenu", function (event) {
            event.preventDefault();
        }, true);

        rendererView.addEventListener('mouseup', function (event) {
            me.gameConfig.mapDrag.state = false;
            me.setTargetPosition(event.offsetX, event.offsetY);
        });

        document.addEventListener("wheel", function (event) {
            var delta = event.deltaY,
                previousScale = me.gameConfig.scale,
                x = event.offsetX,
                y = event.offsetY;

            if (delta > 0 && me.gameConfig.scale > me.gameConfig.minScale) {
                me.gameConfig.scale -= me.gameConfig.scaleStep;
            }

            if (delta < 0 && me.gameConfig.scale < me.gameConfig.maxScale) {
                me.gameConfig.scale += me.gameConfig.scaleStep;
            }


            var worldPos = {
                x: (x - stage.position.x) / previousScale,
                y: (y - stage.position.y) / previousScale
            };

            var newScreenPos = {
                x: (worldPos.x ) * me.gameConfig.scale + stage.position.x,
                y: (worldPos.y) * me.gameConfig.scale + stage.position.y
            };

            stage.position.x -= (newScreenPos.x - x);
            stage.position.y -= (newScreenPos.y - y);

            stage.scale.x = me.gameConfig.scale;
            stage.scale.y = me.gameConfig.scale;

            me.correctStage();

            me.setTargetPosition(event.offsetX, event.offsetY);

            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        });


    };


    this.update = function(){

        GameMap.superclass.update.apply(me);


    };

}

extend(GameMap, VisualEntity);