import { SettingsButton } from '../../interfaces/settings-object.interface';

export type SettingsButtonKey = 'a'
 | 'b'
 | 'd'
 | 'c';

// Add `SettingsButtons` items here so they show up in the buttons ribbon and in the settings
// Each array separates buttons into their own button groups visually
export const SettingsButtonsGroups: SettingsButtonKey[][] = [
  [ // 0 - Search & filter settings
    'a',
    'd',
  ],
  [ // 1 - Search filters
    'b',
  ],
  [ // 2 - Filters & sorting options
    'c',
  ]
];

// Breaks up content into 3 tabs
export const SettingsMetaGroup: string[][] = [
  [
    ...SettingsButtonsGroups[0],
    'break',
    ...SettingsButtonsGroups[1],
  ],
  [
    ...SettingsButtonsGroups[2],
  ]
];

// correspond to each group (tab) above
export const SettingsMetaGroupLabels: string[] = [
  'SETTINGS.a',
  'SETTINGS.b',
  'SETTINGS.c',
];

export type SettingsButtonsType = { [key in SettingsButtonKey]: SettingsButton };

export const SettingsButtons: SettingsButtonsType = {
  'a': {
    description: 'BUTTONS.a',
    hidden: false,
    iconName: 'icon-gear',
    moreInfo: 'BUTTONS.a',
    hoverText: 'BUTTONS.a',
    toggled: true
  },
  'b': {
    description: 'BUTTONS.b',
    hidden: false,
    iconName: 'icon-close',
    moreInfo: 'BUTTONS.b',
    hoverText: 'BUTTONS.b',
    toggled: false
  },
  'c': {
    description: 'BUTTONS.c',
    hidden: false,
    iconName: 'icon-show-more-info',
    moreInfo: 'BUTTONS.c',
    hoverText: 'BUTTONS.c',
    toggled: false
  },
  'd': {
    description: 'BUTTONS.d',
    hidden: false,
    iconName: 'icon-gear',
    moreInfo: 'BUTTONS.d',
    hoverText: 'BUTTONS.d',
    toggled: false
  },
}
