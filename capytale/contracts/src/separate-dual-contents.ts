/**
 * Ce module définit un contrat d'échange des contenus.
 */

/**
 * Un contrat pour gérer un contenu et des données binaires séparés : le contenu et les données binaires de l'activité
 * (côté prof) et le contenu et les données binaires de l'assignment (côté élève) sont différents.
 *
 * @param TActivityContent le type du contenu de l'activité
 * @param TAssignmentContent le type du contenu de l'assignment
 * @param TActivityBinaryData le type des données binaires associées au contenu de l'activité
 * @param TAssignmentBinaryData le type des données binaires associées au contenu de l'assignment
 */
export type SeparateDualContentsV1<TActivityContent, TAssignmentContent, TActivityBinaryData, TAssignmentBinaryData> = {
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
     * @param params - L'objet contenant les données à charger
     * @param params.activityContent - Le contenu de l'activité (côté prof)
     * @param params.assignmentContent - Le contenu de l'assignment (côté élève). 
     *   `undefined` si le mode est "create" ou "view" (pas de copie élève),
     *   `null` si le mode est "assignment" ou "review" mais que la copie élève est vide
     * @param params.activityBinaryData - Les données binaires associées au contenu de l'activité
     * @param params.assignmentBinaryData - Les données binaires associées au contenu de l'assignment.
     *   `undefined` si le mode est "create" ou "view" (pas de copie élève),
     *   `null` si le mode est "assignment" ou "review" mais que la copie élève est vide
     */
    loadContent(params: {
      activityContent: TActivityContent | null;
      assignmentContent: TAssignmentContent | null | undefined;
      activityBinaryData: TActivityBinaryData | null;
      assignmentBinaryData: TAssignmentBinaryData | null | undefined;
    }): void;

    /**
     * Dans le mode "create", le *MetaPlayer* appelle cette méthode pour récupérer les données prof
     * de l'*Application*.
     * 
     * L'*Application* peut donner `null` pour `content` et/ou `binaryData` si le contenu correspond à la valeur par défaut initiale.
     * 
     * @returns le contenu et les données binaires de l'activité
     */
    getActivityContentAndData(): { content: TActivityContent | null; binaryData: TActivityBinaryData | null };

    /**
     * Dans les mode "assignment" et "review", le *MetaPlayer* appelle cette méthode pour récupérer les données
     * élève de l'*Application*.
     * 
     * L'*Application* peut donner `null` pour `content` et/ou `binaryData` si le contenu correspond à la valeur par défaut initiale.
     * 
     * @returns le contenu et les données binaires de l'assignment
     */
    getAssignmentContentAndData(): { content: TAssignmentContent | null; binaryData: TAssignmentBinaryData | null };

    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que le contenu a été sauvegardé.
     */
    contentSaved(): void;
  };
}
