/**
 * Représente un lien de bas niveau entre les deux parties.
 * Identique de chaque côté.
 */
export type Link = {
    /**
     * Indique si le lien est prêt à être utilisé.
     * Typiquement, l'application a l'initiative de la connexion :
     *  - côté application : true dès le départ,
     *  - côté metaplayer : après avoir reçu au moins un message de déclaration de contrats.
     */
    readonly isReady: boolean;

    /**
     * Déclare un groupe de contrats à la partie distante.
     * Ils constituent un groupe de dépendances.
     * 
     * @param ids un tableau d'identifiants de contrats (nom + version)
     * @returns une promesse résolue lorsque la partie distante a pris en compte la déclaration
     */
    declare(ids: { name: string, version?: number }[]): Promise<void>;

    /**
     * Indique que la déclaration des contrats est terminée.
     */
    done(): Promise<void>;

    /**
     * Fournit l'implémentation d'un contrat à la partie distante.
     * 
     * @param name nom du contrat
     * @param version version du contrat
     * @param i implémentation du contrat
     * @returns une promesse résolue lorsque la partie distante a pris en compte l'implémentation
     */
    provide(name: string, version: number, i: any): Promise<void>;

    /**
     * Événement déclenché lorsque la partie distante déclare un groupe de contrats.
     */
    onDeclare?: (ids: { name: string, version: number }[]) => void;

    /**
     * Événement déclenché lorsque la partie distante a terminé de déclarer ses contrats.
     */
    onDone?: () => void;

    /**
     * Événement déclenché lorsque la partie distante fournit l'implémentation d'un contrat.
     */
    onProvide?: (name: string, version: number, i: any) => void;
}