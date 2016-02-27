function Map(renderer, stage, gameConfig){

    renderer.view.addEventListener('mousemove', function (event) {

        if (GAME_CONFIG.mapDrag.state) {
            stage.position.x += event.offsetX - GAME_CONFIG.mapDrag.x;
            stage.position.y += event.offsetY - GAME_CONFIG.mapDrag.y;
            GAME_CONFIG.mapDrag.x = event.offsetX;
            GAME_CONFIG.mapDrag.y = event.offsetY;
        } else {
            setTargetPosition(event.offsetX, event.offsetY);
        }

    });

    renderer.view.addEventListener('mousedown', function (event) {

        if (event.which == 1) {
            //setTargetPosition(event.offsetX, event.offsetY);
            ship.fireCannons();
            //ship2.fireCannons();
        }

        if (event.which == 3) {
            GAME_CONFIG.mapDrag.state = true;
            GAME_CONFIG.mapDrag.x = event.offsetX;
            GAME_CONFIG.mapDrag.y = event.offsetY;

        }

        console.log(event);
    });

    window.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    }, true);

    renderer.view.addEventListener('mouseup', function (event) {
        GAME_CONFIG.mapDrag.state = false;
        setTargetPosition(event.offsetX, event.offsetY);
    });


    document.addEventListener("wheel", function (event) {
        var delta = event.deltaY,
            zoomDir,
            previousScale = GAME_CONFIG.scale,
            scaleXPecentage = event.offsetX / GAME_CONFIG.gameField.width,
            scaleYPecentage = event.offsetY / GAME_CONFIG.gameField.height;

        if (delta > 0 && GAME_CONFIG.scale > GAME_CONFIG.minScale) {
            GAME_CONFIG.scale -= GAME_CONFIG.scaleStep;
        }

        if (delta < 0 && GAME_CONFIG.scale < GAME_CONFIG.maxScale) {
            GAME_CONFIG.scale += GAME_CONFIG.scaleStep;
        }

        stage.scale.x = GAME_CONFIG.scale;
        stage.scale.y = GAME_CONFIG.scale;

        stage.position.x += (GAME_CONFIG.width * previousScale - GAME_CONFIG.width * GAME_CONFIG.scale) * scaleXPecentage;
        stage.position.y += (GAME_CONFIG.height * previousScale - GAME_CONFIG.height * GAME_CONFIG.scale) * scaleYPecentage;

        setTargetPosition(event.offsetX, event.offsetY);

        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    });


}