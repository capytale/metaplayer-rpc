import type { MetaplayerUI as Types } from "./types";

export type MetaPlayerUIV1 = {
  version: 1;

  /**
   * L'interface qui expose le *MetaPlayer* à l'*Application*.
   */
  metaplayer: {
    /**
     * L'*Application* peut appeler cette méthode pour définir les boutons d'action rapide.
     * @param actions Un tableau d'objets décrivant les boutons d'action rapide.
     */
    setQuickActionButtons(actions: Types.QuickActionInfo[]): void;

    /**
     * L'*Application* peut appeler cette méthode pour définir les boutons d'action dans la barre latérale.
     * @param actions Un tableau d'objets décrivant les boutons d'action dans la barre latérale.
     */
    setSidebarActionButtons(actions: Types.QuickActionInfo[]): void;

    /**
     * L'*Application* peut appeler cette méthode pour définir l'interface utilisateur des paramètres de l'activité.
     * @param settingsUI Un objet décrivant l'interface utilisateur des paramètres de l'activité.
     */
    setSettingsUI(settingsUI: Types.ActivitySettings | null): void;

    /**
     * L'*Application* peut appeler cette méthode pour demander au *MetaPlayer* de prévisualiser un fichier texte.
     * @param title le titre du fichier texte à prévisualiser.
     * @param content le contenu du fichier texte à prévisualiser.
     */
    previewTextFile(title: string, content: string): void;

    /**
     * L'*Application* peut appeler cette méthode pour demander au *MetaPlayer* de prévisualiser un fichier image.
     * @param title le titre du fichier image à prévisualiser.
     * @param url l'URL du fichier image à prévisualiser.
     */
    previewImageFile(title: string, url: string): void;

    /**
     * L'*Application* peut appeler cette méthode pour afficher une notification.
     * @param message Un objet décrivant le message à afficher.
     * @returns L'identifiant de la notification affichée.
     */
    showToast(message: Types.MPToastMessage): Types.ToastId;

    /**
     * L'*Application* peut appeler cette méthode pour effacer une notification.
     * @param id L'identifiant de la notification à effacer.
     */
    clearToast(id: Types.ToastId): void;

    /**
     * L'*Application* peut appeler cette méthode pour effacer toutes les notifications.
     */
    clearToasts(): void;
  };

  /**
   * L'interface qui expose l'*Application* au *MetaPlayer*.
   */
  application: {
    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que l'utilisateur a cliqué sur un bouton de type action.
     *
     * @param id l'identifiant de l'action associée au bouton cliqué.
    */
    executeAction(id: string): void;
    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que l'utilisateur a cliqué sur un bouton de type file-upload.
     *
     * @param id l'identifiant de l'action associée au bouton cliqué.
     * @param file le fichier chargé par l'utilisateur.
    */
    executeFileUpload(id: string, file: File): void;

    /**
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que l'utilisateur a modifié un ou plusieurs paramètres de l'activité.
     *
     * @param settings Un objet donnant les paramètres modifiés de l'activité.
    */
    updateSettings(settings: Record<string, any>): void;
  };
}

