var GAME_CONFIG = {
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    maxScale: 2,
    minScale: 0.2,
    scaleStep: 0.1,
    mapDrag: {
        state: false,
        x: 0,
        y: 0
    },
    gameField: {
        width: 15000,
        height: 15000
    }
};



var renderer = PIXI.autoDetectRenderer(GAME_CONFIG.width, GAME_CONFIG.height, {backgroundColor: 0x1099bb});
document.body.appendChild(renderer.view);

Service('GAMECONFIG', GAME_CONFIG);
Service('renderer', renderer);

stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";
stats.domElement.style.left = "0px";
document.body.appendChild(stats.domElement);


// create the root of the scene graph
var mainContainer = new PIXI.Container();

var game = new Game();



var map = new GameMap();
map.init(mainContainer);

var gameGUI = new GUI();
gameGUI.init(mainContainer, GAME_CONFIG);

var ship = new UserControlShip(CONFIG.battleshipConfig);
ship.init(map.getShipsContainer());
ship.x = 500;
ship.y = 500;


game.addChild(map);
game.addChild(ship);
game.addChild(gameGUI);



//var ship2 = new BattleShip(CONFIG.battleshipConfig);
//ship2.init(stage);
//ship2.x = 800;
//ship2.y = 650;


// start animating
animate();
function animate() {
    stats.begin();
    requestAnimationFrame(animate);


    // render the container
    game.update();
    //ship2.update();

    renderer.render(mainContainer);
    stats.end();
}


document.addEventListener('keydown', function (event) {
    ship.setKey(event.keyCode, true);
    //ship2.setKey(event.keyCode, true);
    //console.log(event.keyCode);
});

document.addEventListener('keyup', function (event) {
    ship.setKey(event.keyCode, false);
    //ship2.setKey(event.keyCode, false);
});


function setTargetPosition(mouseX, mouseY) {
    var x = (mouseX - stage.position.x) / GAME_CONFIG.scale,
        y = (mouseY - stage.position.y) / GAME_CONFIG.scale;

    ship.setPointerPos(x, y);
    //ship2.setPointerPos(x, y);
}
