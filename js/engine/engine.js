var GAME_CONFIG = {
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    maxScale: 2,
    minScale: 0.2,
    scaleStep: 0.1,
    mapDrag: {
        state : false,
        x : 0,
        y : 0
    },
    gameField : {
        width : 10000,
        height : 10000
    }
};

var renderer = PIXI.autoDetectRenderer(GAME_CONFIG.width, GAME_CONFIG.height, {backgroundColor: 0x1099bb});
document.body.appendChild(renderer.view);

stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";
stats.domElement.style.left = "0px";
document.body.appendChild(stats.domElement);

// create the root of the scene graph
var stage = new PIXI.Container();

var seatTileTexture = PIXI.Texture.fromImage('images/sea-mapx.jpg');
var tilingSprite = new PIXI.extras.TilingSprite(seatTileTexture, GAME_CONFIG.gameField.width, GAME_CONFIG.gameField.height);
tilingSprite.position.x = -GAME_CONFIG.gameField.width/2;
tilingSprite.position.y = -GAME_CONFIG.gameField.height/2;
stage.addChild(tilingSprite);



var ship = new UserControlShip(CONFIG.battleshipConfig);
ship.init(stage);
ship.x = 500;
ship.y = 500;

//var ship2 = new BattleShip(CONFIG.battleshipConfig);
//ship2.init(stage);
//ship2.x = 800;
//ship2.y = 650;




// start animating
animate();
function animate() {
    stats.begin();
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    //ship.rotation += 0.01;

    // render the container
    ship.update();
    //ship2.update();

    renderer.render(stage);
    stats.end();
}

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

addEventListener("contextmenu", function (event) {
    event.preventDefault();
}, true);

renderer.view.addEventListener('mouseup', function (event) {
    GAME_CONFIG.mapDrag.state = false;
    setTargetPosition(event.offsetX, event.offsetY);
});

document.addEventListener('keydown', function (event) {
    ship.setKey(event.keyCode, true);
    //ship2.setKey(event.keyCode, true);
    //console.log(event.keyCode);
});

document.addEventListener('keyup', function (event) {
    ship.setKey(event.keyCode, false);
    //ship2.setKey(event.keyCode, false);
});

document.addEventListener("wheel", function (event) {
    var delta = event.deltaY, zoomDir, previousScale = GAME_CONFIG.scale,
        scaleXPecentage = event.offsetX / GAME_CONFIG.width,
        scaleYPecentage = event.offsetY / GAME_CONFIG.height;

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


function setTargetPosition(mouseX, mouseY) {
    var x = (mouseX - stage.position.x) / GAME_CONFIG.scale,
        y = (mouseY - stage.position.y) / GAME_CONFIG.scale;

    ship.setPointerPos(x, y);
    //ship2.setPointerPos(x, y);
}
