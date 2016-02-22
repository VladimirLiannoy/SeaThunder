var Observer = {
    events: {},

    addListener: function (eventName, cbFunc, scope) {
        var me = this;

        if (!me.events[eventName]) {
            me.events[eventName] = [];
        }

        me.events[eventName].push({
            func: cbFunc,
            scope: scope
        });

    },

    fireEvent: function (eventName, params) {
        var me = this,
            i;

        console.error('event:' + eventName);

        if (me.events[eventName]) {

            for (i = 0; i < me.events[eventName].length; i++) {

                if (me.events[eventName][i].scope) {
                    me.events[eventName][i].func.call(me.events[eventName][i].scope, params);
                } else {
                    me.events[eventName][i].func(params);
                }

            }
        }

    }
};