export type QuickActionInfo = {
  title: string;
  icon: string;
  id: string;
} & (
    | {
      type: "action";
    }
    | {
      type: "file-upload";
      accept?: string;
    }
  );

export type MPToastMessage = {
  /**
   * Severity of the message.
   */
  severity?: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
  /**
   * Summary content of the message.
   */
  summary?: string;
  /**
   * Detail content of the message.
   */
  detail?: string;
  /**
   * Whether the message can be closed manually using the close icon.
   */
  closable?: boolean;
  /**
   * When enabled, message is not removed automatically.
   */
  sticky?: boolean;
  /**
   * Delay in milliseconds to close the message automatically.
   */
  life?: number;
}

export type ActivitySettingsSelect = {
  type: "select";
  options: {
    label: string;
    name: string;
  }[];
  selectedOptionName: string;
};

export type ActivitySettingsRange = {
  type: "range";
  min: number;
  max: number;
  step?: number;
  value: number;
};

export type ActivitySettingsTextArea = {
  type: "textarea";
  value: string;
};

export type ActivitySettingsOption = {
  type: "checkbox" | "switch";
  value: boolean;
};

export type ActivitySettingsInput = {
  type: "input";
  inputType:
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  value: string | number;
};

export type ActivitySettingsFormSection = {
  type: "form";
  fields: {
    [name: string]: (
      | ActivitySettingsRange
      | ActivitySettingsInput
      | ActivitySettingsTextArea
      | ActivitySettingsOption
      | ActivitySettingsSelect
    ) & {
      label: string;
    };
  };
};

export type ActivitySettingsMultipleOptionsSection = {
  type: "checkboxes" | "switches";
  options: {
    label: string;
    name: string;
  }[];
  selectedOptionNames: string[];
};

export type ActivitySettingsRadioOptionsSection = {
  type: "radio";
  options: {
    label: string;
    name: string;
  }[];
  selectedOptionName: string | null;
};

export type ActivitySettingsSection = (
  | ActivitySettingsMultipleOptionsSection
  | ActivitySettingsRadioOptionsSection
  | ActivitySettingsFormSection
) & {
  title: string;
};

export type ActivitySettings = { [id: string]: ActivitySettingsSection };


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
    setQuickActionButtons(actions: QuickActionInfo[]): void;

    /**
     * L'*Application* peut appeler cette méthode pour définir les boutons d'action dans la barre latérale.
     * @param actions Un tableau d'objets décrivant les boutons d'action dans la barre latérale.
     */
    setSidebarActionButtons(actions: QuickActionInfo[]): void;

    /**
     * L'*Application* peut appeler cette méthode pour définir l'interface utilisateur des paramètres de l'activité.
     * @param settingsUI Un objet décrivant l'interface utilisateur des paramètres de l'activité.
     */
    setSettingsUI(settingsUI: ActivitySettings | null): void;

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
     */
    showToast(message: MPToastMessage): void;
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
     * Le *MetaPlayer* appelle cette méthode pour indiquer à l'*Application* que l'utilisateur a modifié les paramètres de l'activité.
     *
     * @param settingsUI Un objet décrivant l'interface utilisateur des paramètres de l'activité.
    */
    updateSettings(settingsUI: ActivitySettings | null): void;
  };
}

