/**
 * Décrit les contrats d'interfaces entre le *MetaPlayer* Capytale
 * et l'*Application* VittaScience
 */

/**
 * Version 1 du contract déjà en vigueur
 */
export type ContractV1 = {
    /** id du contrat */
    id: 'lti.vs:1';

    /**
     * L'interface exposée par le *MetaPlayer* et consommée par l'*Application*.
     */
    metaplayer: {
        ping(): 'pong';

        /**
         * L'*Application* doit appeler la méthode `loaded` pour indiquer au *MetaPlayer*
         * qu'elle est prête.
        */
        loaded(): void;

        /**
         * L'*Application* doit appeler la méthode `edited` pour indiquer au *MetaPlayer*
         * que le contenu a été modifié par l'utilisateur.
         */
        edited(): void;
    };

    /**
     * L'interface exposée par l'*Application* et consommée par le *MetaPlayer*.
     */
    application: {
        ping(): 'pong';

        /**
         * Le *MetaPlayer* appelle la méthode `save` pour demander à l'*Application*
         * de sauvegarder le projet dans son backend.
         * 
         * @returns 'saved' si la sauvegarde a réussi.
         */
        save(): 'saved';

        /**
         * Le *MetaPlayer* appelle la méthode `reset` pour demander à l'*Application*
         * de réinitialiser le projet dans son backend.
         * 
         * @returns 'reset' si la réinitialisation a réussi.
         */
        reset(): 'reset';
    };
}

/**
 * JSON d'un projet VS utilisé dans la version V2 du contrat
 * Certains champs sont ignorés.
 * Pour les autres, le nom de la colonne dans la table en base de données est indiqué en commentaire.
 */
type ProjectData = {
    id: number;           // colonne `id`
    user: {
        id: number,     // colonne `user`
        // ...
    },
    name: string;         // colonne `project_name`
    description: string;  // colonne `project_description`
    dateUpdated: {
        date: string;              // colonne `interface_date`
        // ex de format json : "2024-01-22 15:56:04.734176"
        // ex de format sql : "2024-01-22 10:24:49"
        // note: ces 2 exemples pris sur des projets différents ne permettent pas
        // de savoir si un décalage horaire est appliqué par doctrine
        timezone_type: number;     // ??? 
        timezone: string;          // ???
    };
    code: string;                  // colonne `code`
    codeText: string | null;       // colonne `code_language`
    codeManuallyModified: boolean; // colonne `manually_modified`
    public: boolean;               // ignoré
    link: string;                  // colonne `link`
    mode: string;                  // colonne `mode`
    interface: string;             // colonne `interface`
    exercise: null | {
        id: number,              // colonne `id_exercise`
        // À confirmer (pas d'exemple)
        // ...
    }
    isExerciseCreator: boolean;    // colonne `is_exercise_creator`
    exerciseStatement: null | {
        id: number,              // colonne `exercise_statement_id`
        // À confirmer (pas d'exemple)
        // ...
    };
    isExerciseStatementCreator: boolean; // colonne `is_exercise_statement_creator`
    sharedUsers: null | unknown;         // ignoré
    sharedStatus: number;                // ignoré
    options: string | null;              // colonne `options`
}

/**
 * Version 2 du contract
 * 
 * Elle est compatible avec la version 1 dans le sens où
 * - un *MetaPlayer* V2 peut communiquer avec une *Application* V1
 * - une *Application* V2 peut communiquer avec un *MetaPlayer* V1
 */
export type ContractV2 = {
    /** id du contrat */
    id: 'lti.vs:2';

    /**
     * L'interface exposée par le *MetaPlayer* et consommée par l'*Application*.
     */
    metaplayer: {
        ping(): 'pong';

        /**
         * L'*Application* doit appeler la méthode `loaded` pour indiquer au *MetaPlayer*
         * qu'elle est prête.
         * Elle doit passer 'lti.vs:2' en paramètre pour indiquer qu'elle
         * implémente le niveau V2.
         * 
         * @param contractId identifiant du contrat
         * @returns 'lti.vs:2' si le *MetaPlayer* implémente le niveau V2.
         *          Pour toute autre valeur de retour, l'*Application doit assumer que
         *          le *MetaPlayer* implémente le niveau V1.
         */
        loaded(contractId?: string): void | string;

        /**
         * L'*Application* doit appeler la méthode `edited` pour indiquer au *MetaPlayer*
         * que le contenu a été modifié par l'utilisateur.
         * Note: aucun changement par rapport à la V1.
         */
        edited(): void;
    };

    /**
     * L'interface exposée par l'*Application* et consommée par le *MetaPlayer*.
     */
    application: {
        ping(): 'pong';

        /**
         * Le *MetaPlayer* appelle la méthode `save` pour demander à l'*Application*
         * de sauvegarder le projet dans son backend.
         * New V2: le *MetaPlayer* peut demander à obtenir les données du projet en retour
         * 
         * @param emit Si `emit` est true, l'*Application* doit retourner les données du projet.
         *             `emit` est omis lorsque l'une des parties implémente la V1.
         * @returns si la sauvegarde a échoué: false (boolean)
         *          si la sauvegarde a réussi:
         *            - si emit est false ou omis: 'saved' (string)
         *            - si emit est true: données du projet (ProjectData)
         */
        save(emit?: boolean): 'saved' | ProjectData;

        /**
         * Le *MetaPlayer* appelle la méthode `reset` pour demander à l'*Application*
         * de réinitialiser le projet dans son backend.
         * New V2: le *MetaPlayer* peut demander à obtenir les données réinitialisées du projet en retour
         * 
         * Note: l'*Application* doit renvoyer les données avant de provoquer
         *       le rechargement de l'iframe.
         * 
         * @param emit Si `emit` est true, l'*Application* doit retourner les données du projet.
         *             `emit` est omis lorsque l'une des parties implémente la V1.
         * @returns Si la réinitialisation a échoué: false (boolean)
         *          Si la réinitialisation a réussi:
         *            - si emit est false ou omis: 'reset' (string)
         *            - si emit est true: données du projet (ProjectData)
         */
        reset(emit?: boolean): 'reset' | ProjectData;
    };
}

/**
 * Note sur l'exposition et l'appel de méthodes avec paramètre.
 * (Il n'y en avait pas dans la V1)
 */

import type { RPC } from '@mixer/postmessage-rpc';

{
    // La construction de l'objet RPC est inchangée.
    // Pour les besoin de l'illustration, on suppose que l'objet RPC est stocké dans la variable rpc.
    // @ts-ignore
    const rpc: RPC = createRpc();

    // Exposition d'une méthode avec paramètre
    // le paramètre est à extraire du tableau args (par déstructuration)
    // exemple de save(emit?: boolean): 'saved' | ProjectData

    // version typescript
    rpc.expose<[boolean]>('save', ([emit]) => {
        emit = emit === true;
        // faire la sauvegarde
        // ...
        // @ts-ignore
        if (failed) return false;
        if (!emit) return 'saved';
        // récupérer les données du projet
        // @ts-ignore
        const projectData: ProjectData = {
            // ...
        }
        return projectData;
    });

    // version javascript
    // @ts-ignore
    rpc.expose('save', ([emit]) => {
        emit = emit === true;
        // faire la sauvegarde
        // ...
        // @ts-ignore
        if (failed) return false;
        if (!emit) return 'saved';
        // récupérer les données du projet
        // @ts-ignore
        const projectData = {
            // ...
        }
        return projectData;
    });

    // Appel d'une méthode avec paramètre
    // le paramètre est à passer dans le tableau args
    // exemple de loaded(contractId?: string): void | string;

    // version typescript
    {
        const contractId = 'lti.vs:2';
        const remoteContractId = await rpc.call<void | string>('loaded', [contractId]);
        // @ts-ignore
        const isV2 = remoteContractId === contractId;
        // ...
    }

    // version javascript
    {
        const contractId = 'lti.vs:2';
        const remoteContractId = await rpc.call('loaded', [contractId]);
        // @ts-ignore
        const isV2 = remoteContractId === contractId;
        // ...
    }
}