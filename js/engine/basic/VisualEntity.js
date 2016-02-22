/**
 * Created by treem on 2/22/16.
 */

function VisualEntity(params){

    VisualEntity.superclass.constructor.call(this, params);

}

VisualEntity.prototype.render = function(){};


extend(VisualEntity, Entity);