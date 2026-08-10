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

export type AllowedExtension = 'jpg' | 'png' | 'gif' | 'jpeg' | 'jxl';

export type AllowedView = 'view1' | 'view2' | 'view3' | 'view4' | 'view5';

export interface RowNumbers {
  view1: number;
  view2: number;
  view3: number;
  view4: number;
  view5: number;
}

export interface ImageFile {
  extension: AllowedExtension;
  fullPath: string;
  safePath: string; // for Tauri to display stuff
  name: string;
  partialPath: string;
  folderPath?: string;
}

export interface myTree {
  depth: number;
  display: boolean;
  expanded: boolean;
  hasChildren: boolean;
  path: string;
  selected: boolean;
  total: number;
}
