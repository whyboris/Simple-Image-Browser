"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsButtons = exports.SettingsMetaGroupLabels = exports.SettingsMetaGroup = exports.SettingsButtonsGroups = void 0;
// Add `SettingsButtons` items here so they show up in the buttons ribbon and in the settings
// Each array separates buttons into their own button groups visually
exports.SettingsButtonsGroups = [
    [
        'folder',
    ],
    [
        'hideTree',
        'autoHide',
    ],
    [
        'view1',
        'view2',
        'view3',
        'view4',
        'view5',
    ],
    [
        'zoomIn',
        'zoomOut'
    ],
    [
        'jpg',
        'jxl',
        'png',
        'gif'
    ]
];
// Breaks up content into 3 tabs
exports.SettingsMetaGroup = [
    __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], exports.SettingsButtonsGroups[0], true), [
        'break'
    ], false), exports.SettingsButtonsGroups[1], true), [
        'break'
    ], false), exports.SettingsButtonsGroups[2], true), [
        'break'
    ], false), exports.SettingsButtonsGroups[3], true), [
        'break'
    ], false), exports.SettingsButtonsGroups[4], true),
    [
    // second tab buttons!
    ]
];
// correspond to each group (tab) above
exports.SettingsMetaGroupLabels = [
    'SETTINGS.ribbon',
    'SETTINGS.b',
    'SETTINGS.c',
];
exports.SettingsButtons = {
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
};
//# sourceMappingURL=settings-buttons.js.map