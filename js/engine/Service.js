/**
 * Created by treem on 2/27/16.
 */

function Service(serviceName, serviceObject){

    if(Service.services[serviceName]){
        return Service.services[serviceName];
    } else if(serviceName && serviceObject){
        Service.services[serviceName] = serviceObject;
    } else {
        console.error('ERRRRROOORRRRR');
    }

}

Service.services = {};