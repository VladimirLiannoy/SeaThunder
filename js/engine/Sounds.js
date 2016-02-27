var fireSound = new Audio('sounds/fire2.mp3');
var reloadedSound = new Audio('sounds/reloaded.mp3');


Observer.addListener('cannonFired', function (cannon) {
    //fireSound.cloneNode().play();
});

Observer.addListener('cannonRechargeFinished', function (cannon) {
    //reloadedSound.cloneNode().play();
});