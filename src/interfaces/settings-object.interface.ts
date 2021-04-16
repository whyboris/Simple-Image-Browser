export interface AllSettings {
  buttons: { [key in SettingsButtonKey]: SettingsButton };
  appState: AppState;
};

export interface AppState {
  zoomLevel: any;
}

export type SettingsButtonKey = 'autoFileTags';

export interface SettingsButton {
  description: string;      // explainer text for users
  hoverText: string;        // hover text
  toggled: boolean;         // default state unless user overrides
  hidden: boolean;          // hidden from the buttons ribbon by default (eye closed icon in settings)
  // optional
  moreInfo?: string;        // hint text in the settings menu when hovering over the `i` icon
  iconName?: string;        // if absent, defaults to `icon-default-button`
  settingsHeading?: string; // Long text to appear in the settings above the button
}
