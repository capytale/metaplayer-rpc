/**
 * Ce module définit le contrat d'échange des contenus.
 */

/**
 * Un contrat pour gérer un contenu simple :
 * - un seul contenu de type `T`
 * - le mode assignment est le même que le mode create c'est à dire que
 *   le contenu initial pour l'élève est celui qui a été préparé par l'enseignant.
 * 
 * @param T le type du contenu
 */
type SimpleContentV1<T> = {
    name: "simple-content";
    version: 1;
    /**
     * L'interface qui expose le *MetaPlayer* à l'*Application*.
    */
    metaplayer: {
        /**
         * L'*Application* doit appeler cette méthode pour indiquer au *MetaPlayer* que le contenu a été modifié par l'utilisateur.
         */
        contentChanged(): void;
    };

    /**
     * L'interface qui expose l'*Application* au *MetaPlayer*.
     */
    application: {
        /**
         * Le *MetaPlayer* appelle cette méthode pour envoyer les données à l'*Application*.
         * 
         * Si `content` est `null`, l'*Application* doit réinitialiser son contenu à la valeur par défaut initiale.
         * Si l'*Application* n'est pas en mesure de charger le contenu, elle lever une exeption.
         * 
         * @param content le contenu de l'activité
        */
        loadContent(content: T | null): void;

        /**
         * Le *MetaPlayer* appelle cette méthode pour récupérer les données de l'*Application*.
         * 
         * L'*Application* peut retourner `null` si le contenu correspond à la valeur par défaut initiale.
         * 
         * @returns le contenu de l'activité
         */
        getContent(): T | null;

        /**
         * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé.
         */
        contentSaved(): void;
    };
}

import type { AddIdData, CollectionOf } from "@capytale/contract-type";

/**
 * Collection des variantes de contrat de contenu simple.
 */
export type SimpleContentContracts = CollectionOf<[
    AddIdData<SimpleContentV1<string>, { variant: "text" }>,
    AddIdData<SimpleContentV1<any>, { variant: "json" }>,
]>;
