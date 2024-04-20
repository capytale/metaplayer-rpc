export type FooV1 = {
    version: 1;
    metaplayer: {
        /**
         * La méthode ping de la version 1
         * 
         * @param echo faut-il logger ?
         * @returns "pong"
         */
        ping(echo: boolean): 'pong';
    };
    application: {
        /**
         * La méthode pong de la version 1
         * 
         * @returns "ping"
         */
        pong(): 'ping';
    };
}

export type FooV2 = {
    version: 2;
    metaplayer: {
        /**
         * La méthode ping de la version 2
         * 
         * @param echo faut-il logger ?
         * @returns "pong"
         */
        ping(echo: boolean): 'pong';
        /**
         * La méthode hello de la version 2
         * 
         * @returns "world"
         */
        hello(): 'world';
    }
    application: {
        /**
         * La méthode pong de la version 2
         * 
         * @returns "ping"
         */
        pong(): 'ping';
    };
}

export type FooV3 = {
    version: 3;
    metaplayer: {
        /**
         * La méthode ping de la version 3
         * 
         * @param echo faut-il logger ?
         * @returns "pong"
         */
        ping(echo: boolean): 'pong';
        /**
         * La méthode hello de la version 3
         * 
         * @returns "world"
         */
        hello(): 'world';
    }
    application: {
        /**
         * La méthode pong de la version 3
         * 
         * @returns "ping"
         */
        pong(): 'ping';
        /**
         * La méthode goodbye de la version 3
         * 
         * @returns "world"
         */
        goodbye(): 'world';
    };
}
