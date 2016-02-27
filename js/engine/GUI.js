/**
 * Created by treem on 2/27/16.
 */
function GUI(container, gameConfig){
var me = this;

this.width = 300;
this.height = 200;

this.rootContainer = new PIXI.Container();
this.rootContainer.position.y = gameConfig.height- this.height;


this.backItem = new PIXI.Graphics();
this.backItem.beginFill('0x000000', 0.7);
this.backItem.drawRect(0, 0, this.width, this.height);


this.shipImg = new PIXI.Sprite.fromImage('images/ship_in_menu.gif');
this.shipImg.anchor.set(0.5, 0);
this.shipImg.position.set(this.width/2, -10);
this.shipImg.scale.set(0.7);

this.rootContainer.addChild(this.backItem);
this.rootContainer.addChild(this.shipImg);

container.addChild(this.rootContainer);





}