var fireSound = new Audio('sounds/fire.mp3');




Observer.addListener('turretFired', function (turret) {
    fireSound.cloneNode().play();
});