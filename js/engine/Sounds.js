var fireSound = new Audio('sounds/fire2.mp3');
var reloadedSound = new Audio('sounds/reloaded.mp3');




Observer.addListener('turretFired', function (turret) {
    //fireSound.cloneNode().play();
});

Observer.addListener('cannonRechargeFinished', function (turret) {
    //reloadedSound.cloneNode().play();
});