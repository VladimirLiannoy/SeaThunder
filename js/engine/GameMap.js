function GameMap() {
    var me = this;

    this.stage = null;
    this.gameConfig = null;


    this.init = function (container) {
        me.stage = new PIXI.Container();
        container.addChild(me.stage);

        me.gameConfig = Service('GAMECONFIG');

        var seatTileTexture = PIXI.Texture.fromImage('images/sea-mapx.jpg');
        var tilingSprite = new PIXI.extras.TilingSprite(seatTileTexture, GAME_CONFIG.gameField.width, GAME_CONFIG.gameField.height);
        me.stage.addChild(tilingSprite);

        me.initEventListeners();

    };

    this.getShipsContainer = function () {
      return me.stage;
    };

    this.correctStage = function () {
        var stage = me.stage,
            GAME_CONFIG = me.gameConfig;

        if (stage.position.x > 0) {
            stage.position.x = 0;
        }

        if (stage.position.x < -GAME_CONFIG.gameField.width * GAME_CONFIG.scale + GAME_CONFIG.width) {
            stage.position.x = -GAME_CONFIG.gameField.width * GAME_CONFIG.scale + GAME_CONFIG.width;
        }

        if (stage.position.y > 0) {
            stage.position.y = 0;
        }

        if (stage.position.y < -GAME_CONFIG.gameField.height * GAME_CONFIG.scale + GAME_CONFIG.height) {
            stage.position.y = -GAME_CONFIG.gameField.height * GAME_CONFIG.scale + GAME_CONFIG.height;
        }
    };

    me.setTargetPosition = function (mouseX, mouseY) {
        var x = (mouseX - me.stage.position.x) / me.gameConfig.scale,
            y = (mouseY - me.stage.position.y) / me.gameConfig.scale;

        Observer.fireEvent('setPointerPos', {x: x, y:y});
    };

    this.initEventListeners = function () {
        var stage = me.stage,
            GAME_CONFIG = me.gameConfig,
            rendererView = Service('renderer').view;

        rendererView.addEventListener('mousemove', function (event) {

            if (GAME_CONFIG.mapDrag.state) {
                stage.position.x += event.offsetX - GAME_CONFIG.mapDrag.x;
                stage.position.y += event.offsetY - GAME_CONFIG.mapDrag.y;
                GAME_CONFIG.mapDrag.x = event.offsetX;
                GAME_CONFIG.mapDrag.y = event.offsetY;

                me.correctStage();

            } else {
                me.setTargetPosition(event.offsetX, event.offsetY);
            }

        });

        rendererView.addEventListener('mousedown', function (event) {

            if (event.which == 1) {
                //me.setTargetPosition(event.offsetX, event.offsetY);
                //ship.fireCannons();
                //ship2.fireCannons();

                Observer.fireEvent('playerTryFire');
            }

            if (event.which == 3) {
                GAME_CONFIG.mapDrag.state = true;
                GAME_CONFIG.mapDrag.x = event.offsetX;
                GAME_CONFIG.mapDrag.y = event.offsetY;

            }

            //console.log(event);
        });

        window.addEventListener("contextmenu", function (event) {
            event.preventDefault();
        }, true);

        rendererView.addEventListener('mouseup', function (event) {
            GAME_CONFIG.mapDrag.state = false;
            me.setTargetPosition(event.offsetX, event.offsetY);
        });

        document.addEventListener("wheel", function (event) {
            var delta = event.deltaY,
                previousScale = GAME_CONFIG.scale,
                x = event.offsetX,
                y = event.offsetY;

            if (delta > 0 && GAME_CONFIG.scale > GAME_CONFIG.minScale) {
                GAME_CONFIG.scale -= GAME_CONFIG.scaleStep;
            }

            if (delta < 0 && GAME_CONFIG.scale < GAME_CONFIG.maxScale) {
                GAME_CONFIG.scale += GAME_CONFIG.scaleStep;
            }


            var worldPos = {
                x: (x - stage.position.x) / previousScale,
                y: (y - stage.position.y) / previousScale
            };

            var newScreenPos = {
                x: (worldPos.x ) * GAME_CONFIG.scale + stage.position.x,
                y: (worldPos.y) * GAME_CONFIG.scale + stage.position.y
            };

            stage.position.x -= (newScreenPos.x - x);
            stage.position.y -= (newScreenPos.y - y);

            stage.scale.x = GAME_CONFIG.scale;
            stage.scale.y = GAME_CONFIG.scale;

            me.correctStage();

            me.setTargetPosition(event.offsetX, event.offsetY);

            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        });


    };

}