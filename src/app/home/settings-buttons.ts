import { SettingsButton } from '../../interfaces/settings-object.interface';

export type SettingsButtonKey = 'folder'
 | 'hideTree'
 | 'autoHide'
 | 'view1'
 | 'view2'
 | 'view3'
 | 'view4'
 | 'zoomIn'
 | 'zoomOut'
 | 'gif'
 | 'jpg'
 | 'jxl'
 | 'png'
 | 'view5';

// Add `SettingsButtons` items here so they show up in the buttons ribbon and in the settings
// Each array separates buttons into their own button groups visually
export const SettingsButtonsGroups: SettingsButtonKey[][] = [
  [ // 0 - open folder
    'folder',
  ],
  [ // 1 - show/hide sidebar
    'hideTree',
    'autoHide',
  ],
  [ // 2 - gallery views
    'view1',
    'view2',
    'view3',
    'view4',
    'view5',
  ],
  [ // 3 -- image size
    'zoomIn',
    'zoomOut'
  ],
  [ // 4 -- file formats
    'jpg',
    'jxl',
    'png',
    'gif'
  ]
];

// Breaks up content into 3 tabs
export const SettingsMetaGroup: string[][] = [
  [
    ...SettingsButtonsGroups[0],
    'break',
    ...SettingsButtonsGroups[1],
    'break',
    ...SettingsButtonsGroups[2],
    'break',
    ...SettingsButtonsGroups[3],
    'break',
    ...SettingsButtonsGroups[4],
  ],
  [
// second tab buttons!
  ]
];

// correspond to each group (tab) above
export const SettingsMetaGroupLabels: string[] = [
  'SETTINGS.ribbon',
  'SETTINGS.b',
  'SETTINGS.c',
];

export type SettingsButtonsType = { [key in SettingsButtonKey]: SettingsButton };

export const SettingsButtons: SettingsButtonsType = {
  'folder': {
    description: 'BUTTONS.folder',
    hidden: false,
    iconName: 'icon-folder',
    moreInfo: 'BUTTONS.folderInfo',
    hoverText: 'BUTTONS.folderHover',
    toggled: false
  },
  'hideTree': {
    description: 'BUTTONS.hideTree',
    hidden: false,
    iconName: 'icon-chevron-left',
    moreInfo: 'BUTTONS.hideTreeInfo',
    hoverText: 'BUTTONS.hideTreeHover',
    toggled: false
  },
  'autoHide': {
    description: 'BUTTONS.autoHide',
    hidden: false,
    iconName: 'icon-eye-closed',
    moreInfo: 'BUTTONS.autoHideInfo',
    hoverText: 'BUTTONS.autoHideHover',
    toggled: false
  },
  'view1': {
    description: 'BUTTONS.view1',
    hidden: false,
    iconName: 'icon-temp1',
    moreInfo: 'BUTTONS.view1Info',
    hoverText: 'BUTTONS.view1Hover',
    toggled: false
  },
  'view2': {
    description: 'BUTTONS.view2',
    hidden: false,
    iconName: 'icon-temp2',
    moreInfo: 'BUTTONS.view2Info',
    hoverText: 'BUTTONS.view2Hover',
    toggled: false
  },
  'view3': {
    description: 'BUTTONS.view3',
    hidden: false,
    iconName: 'icon-temp3',
    moreInfo: 'BUTTONS.view3Info',
    hoverText: 'BUTTONS.view3Hover',
    toggled: false
  },
  'view4': {
    description: 'BUTTONS.view4',
    hidden: false,
    iconName: 'icon-temp4',
    moreInfo: 'BUTTONS.view4Info',
    hoverText: 'BUTTONS.view4Hover',
    toggled: false
  },
  'view5': {
    description: 'BUTTONS.view5',
    hidden: false,
    iconName: 'icon-temp5',
    moreInfo: 'BUTTONS.view5Info',
    hoverText: 'BUTTONS.view5Hover',
    toggled: false
  },
  'zoomIn': {
    description: 'BUTTONS.zoomIn',
    hidden: false,
    iconName: 'icon-plus',
    moreInfo: 'BUTTONS.zoomInInfo',
    hoverText: 'BUTTONS.zoomInHover',
    toggled: false
  },
  'zoomOut': {
    description: 'BUTTONS.zoomOut',
    hidden: false,
    iconName: 'icon-minus',
    moreInfo: 'BUTTONS.zoomOutInfo',
    hoverText: 'BUTTONS.zoomOutHover',
    toggled: false
  },
  'jpg': {
    description: 'BUTTONS.jpg',
    hidden: false,
    iconName: 'icon-jpg',
    moreInfo: 'BUTTONS.jpgInfo',
    hoverText: 'BUTTONS.jpgHover',
    toggled: false
  },
  'jxl': {
    description: 'BUTTONS.jxl',
    hidden: false,
    iconName: 'icon-jxl',
    moreInfo: 'BUTTONS.jxlInfo',
    hoverText: 'BUTTONS.jxlHover',
    toggled: false
  },
  'png': {
    description: 'BUTTONS.png',
    hidden: false,
    iconName: 'icon-png',
    moreInfo: 'BUTTONS.pngInfo',
    hoverText: 'BUTTONS.pngHover',
    toggled: false
  },
  'gif': {
    description: 'BUTTONS.gif',
    hidden: false,
    iconName: 'icon-gif',
    moreInfo: 'BUTTONS.gifInfo',
    hoverText: 'BUTTONS.gifHover',
    toggled: false
  },
}
