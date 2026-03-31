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
    value: string;
  }[];
  defaultValue: string;
};

export type ActivitySettingsRange = {
  type: "range";
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
};

export type ActivitySettingsTextArea = {
  type: "textarea";
  defaultValue: string;
};

export type ActivitySettingsOption = {
  type: "checkbox" | "switch";
  defaultValue: boolean;
};

export type ActivitySettingsInput = {
  type: "input";
  inputType:
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
  defaultValue: string;
};

export type ActivitySettingsNumberInput = {
  type: "input";
  inputType: "number";
  defaultValue: number;
};

export type FormField = (
  | ActivitySettingsRange
  | ActivitySettingsInput
  | ActivitySettingsNumberInput
  | ActivitySettingsTextArea
  | ActivitySettingsOption
  | ActivitySettingsSelect
) & {
  label: string;
  name: string;
  modes?: ("assignment" | "create" | "review" | "view")[];
};

export type ActivitySettingsFormSection = {
  type: "form";
  fields: FormField[];
};

export type ActivitySettingsMultipleOptionsSection = {
  name: string;
  type: "checkboxes" | "switches";
  options: {
    label: string;
    value: string;
  }[];
  defaultValues: string[];
};

export type ActivitySettingsRadioOptionsSection = {
  name: string;
  type: "radio";
  options: {
    label: string;
    value: string;
  }[];
  defaultValue: string | null;
};

export type ActivitySettingsSection = (
  | ActivitySettingsMultipleOptionsSection
  | ActivitySettingsRadioOptionsSection
  | ActivitySettingsFormSection
) & {
  title: string;
  modes?: ("assignment" | "create" | "review" | "view")[];
};

export type ActivitySettings = ActivitySettingsSection[];

export type ToastId = number;
