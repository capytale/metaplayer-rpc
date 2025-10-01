export type MetaPlayerEventsV1 = {
  version: 1;

  /**
   * L'interface qui expose le *MetaPlayer* à l'*Application*.
   */
  metaplayer: {
    // Rien
  };

  /**
   * L'interface qui expose l'*Application* au *MetaPlayer*.
   */
  application: {
    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* qu'un événement a eu lieu.
     *
     * @param event l'identifiant de l'événement qui a eu lieu (pour l'instant seulement "all-loaded", qui indique que tous les contrats liés au chargement initial de l'activité ont été appelés par le *MetaPlayer*).
    */
    handleEvent(event: "all-loaded" | (string & {})): void;
  };
}
