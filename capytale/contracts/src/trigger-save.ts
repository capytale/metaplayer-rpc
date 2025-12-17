/**
 * Ce module définit la possibilité pour l'application de déclencher une sauvegarde.
 */

/**
 * Un contrat pour gérer le déclenchement de la sauvegarde.
 */
export type TriggerSaveV1 = {
  version: 1;

  /**
   * L'interface qui expose le *MetaPlayer* à l'*Application*.
   */
  metaplayer: {
    /**
     * L'*Application* peut appeler cette méthode pour savoir si une sauvegarde peut être déclenchée.
     * 
     * @returns true si la sauvegarde peut être déclenchée, false sinon.
     */
    getCanSave(): boolean;

    /**
     * L'*Application* peut appeler cette méthode pour déclencher une sauvegarde.
     * @return true si la sauvegarde a été déclenchée, false sinon.
     */
    triggerSave(): boolean;
  };

  /**
   * L'interface qui expose l'*Application* au *MetaPlayer*.
   */
  application: {
    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer si une sauvegarde peut être déclenchée ou non.
     * Sera appelé au moins une fois au démarrage, puis à chaque changement.
     * 
     * @param canSave true si la sauvegarde peut être déclenchée, false sinon.
    */
    setCanSave(canSave: boolean): void;
  };
}
