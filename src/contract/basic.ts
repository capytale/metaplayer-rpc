/**
 * Dans la communication entre le *MetaPlayer* et l'*Application*, chaque partie doit disposer d'une interface
 * qui lui permet d'intéragir à distance avec l'autre partie. Ces interfaces sont définies ici :
 * 
 * - Le *MetaPlayer* intéragit avec l'*Application* au travers de l'interface `ApplicationConnection`.
 * - L'*Application* intéragit avec le *MetaPlayer* au travers de l'interface `MetaPlayerConnection`.
 * 
 * L'implémentation et la façon dont chacune est exposée à l'autre partie ne sont pas définies ici.
 */


type Manifest = {
    name: string,
    version: string,
    features?: string[],
}

export type MetaPlayerManifest = Manifest & {
    side: 'MetaPlayer'
}

export type ApplicationManifest = Manifest & {
    side: 'Application'
}

/**
 * Indique le mode de consultation de l'activité.  
 * `view`: visionnage depuis la bibliothèque sans droit d'écriture  
 * `create`: Création ou modification par l'enseignant  
 * `assignment`: visionnage et modification d'une copie par l'élève  
 * `review`: visionnage et correction d'une copie par l'enseignant  
 * 
 * @enum
 */
export type ActivityMode =
    'view' |
    'create' |
    'assignment' |
    'review';

/**
 * L'interface qui expose le *MetaPlayer* à l'*Application*.
 */
type MetaPlayerContract = {
    ping(): 'pong';

    /**
     * L'*Application* doit appeler cette méthode lorsqu'elle est prête à recevoir des données du *MetaPlayer*.
     * L'*Application* peut passer un manifest au *MetaPlayer* pour lui indiquer ses capacités.
     * 
     * Le *MetaPlayer* retourne le manifest du *MetaPlayer* si il existe.
     * Le *MetaPlayer* ne devrait pas appeler de méthode sur l'*Application* avant que cette méthode soit appelée.
     * 
     * @param manifest Le manifest de l'*Application*.
     * @returns Le manifest du *MetaPlayer*.
     */
    appReady(manifest?: ApplicationManifest): MetaPlayerManifest | void;

    /**
     * L'*Application* doit appeler cette méthode pour indiquer au *MetaPlayer* que le contenu a été modifié par l'utilisateur.
     */
    contentChanged(): void;
}

/**
 * L'interface qui expose l'*Application* au *MetaPlayer*.
 */
type ApplicationContract = {
    ping(): 'pong';

    /**
     * Le *MetaPlayer* appelle cette méthode pour envoyer les données à l'*Application*.
     * 
     * Si `content` est `null`, l'*Application* doit réinitialiser son contenu à la valeur par défaut initiale.
     * Si l'*Application* n'est pas en mesure de charger le contenu, elle lever une exeption.
     * 
     * @param mode le mode de consultation de l'activité
     * @param content le contenu de l'activité
    */
    loadContent(mode: ActivityMode, content: string | null): void;

    /**
     * Le *MetaPlayer* appelle cette méthode pour récupérer les données de l'*Application*.
     * 
     * L'*Application* peut retourner `null` si le contenu correspond à la valeur par défaut initiale.
     * 
     * @returns le contenu de l'activité
     */
    getContent(): string | null;

    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé.
     */
    contentSaved(): void;
}

export type Contract = {
    metaplayer: MetaPlayerContract;
    application: ApplicationContract;
}
