function Turret(myShip, config) {
    var me = this;

    var rootContainer,
        turret,
        bulletsFired = [],
        aim;

    this.x = config.x;
    this.y = config.y;
    this.rotation = 0;
    this.radCompensation = config.radCompensation;

    this.myShip = myShip;

    this.init = function (container) {

        rootContainer = new PIXI.Container();
        rootContainer.position = new PIXI.Point(me.x, me.y);

        turret = new PIXI.Sprite.fromImage('images/turret.png');
        turret.anchor.set(0.5);
        turret.scale.set(0.6);
        turret.rotation = config.radCompensation;

        aim = new PIXI.Graphics();

        rootContainer.addChild(turret);
        rootContainer.addChild(aim);

        container.addChild(rootContainer);

        me.setupEvents();
    };

    this.update = function () {
        var x, y, rad, dist, newXY, bullet;

        newXY = calcNewCoords(me.myShip.rotation, me.x, me.y);

        x = me.myShip.x + newXY.x;
        y = me.myShip.y + newXY.y;

        rad = Math.atan2((me.myShip.target.y - y), (me.myShip.target.x - x));
        me.rotation = rad;
        rootContainer.rotation = me.rotation - me.myShip.rotation;

        dist = Math.sqrt(Math.pow((me.myShip.target.x - x), 2) + Math.pow((me.myShip.target.y - y), 2));
        aim.clear();
        aim.lineStyle(1, 0xf3a33f);
        aim.moveTo(0, 0);
        aim.lineTo(dist, 0);
        aim.endFill();


        for (i = 0; i < bulletsFired.length; i++) {
            bullet = bulletsFired[i];
            bullet.update();
        }

    };

    this.fire = function () {
        var newBullet, x, y, newXY, rotation;

        rotation = me.rotation;

        newXY = calcNewCoords(me.myShip.rotation, me.x, me.y);

        x = me.myShip.x + newXY.x;
        y = me.myShip.y + newXY.y;

        newBullet = new Bullet(x, y, rotation, me.myShip.target.x, me.myShip.target.y);
        newBullet.init(me.myShip.parentContainer);
        newBullet.onTargetReached = function (bullet) {
            bulletsFired.splice(bulletsFired.indexOf(bullet), 1);
        }.bind(me);

        bulletsFired.push(newBullet);

        var marker = new PIXI.Graphics();
        marker.clear();
        marker.beginFill('red');
        marker.drawCircle(0, 0, 10);
        marker.endFill();
        marker.position.x = me.myShip.target.x;
        marker.position.y = me.myShip.target.y;

        me.myShip.parentContainer.addChild(marker);

        Observer.fireEvent('turretFired', me);
    };

    this.setupEvents = function(){

        Observer.addListener('targetReached', function (bullet) {

            console.log(bulletsFired, bullet.targetReached);

            if(bullet.targetReached){
                bulletsFired.splice(bulletsFired.indexOf(bullet), 1);
            }



        })

    };

}