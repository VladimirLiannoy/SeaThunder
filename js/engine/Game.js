/**
 * Created by treem on 2/28/16.
 */
function Game(params){
    var me = this;

    Game.superclass.constructor.apply(me, params);
}


extend(Game, VisualEntity);