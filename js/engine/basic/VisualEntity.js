/**
 * Created by treem on 2/22/16.
 */

function VisualEntity(params){

    VisualEntity.superclass.constructor.call(this, params);

    this.parentContainer = null;
    this.rootContainer = null;

}

VisualEntity.prototype.render = function(){};


extend(VisualEntity, Entity);