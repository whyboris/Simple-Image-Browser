"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var angular_tree_component_1 = require("@circlon/angular-tree-component");
var core_2 = require("@ngx-translate/core");
var electron_service_1 = require("../electron.service");
var image_service_1 = require("../image.service");
var settings_buttons_1 = require("./settings-buttons");
var languages_1 = require("../languages");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(cd, imageService, translate, electronService) {
        var _this = this;
        this.cd = cd;
        this.imageService = imageService;
        this.translate = translate;
        this.electronService = electronService;
        this.allImages = [];
        this.allowedExtensions = ['png', 'jpg', 'jxl'];
        this.appMaximized = false;
        this.expanded = false;
        this.nodes = [];
        this.numOfColumns = 5;
        this.partialPath = '/';
        this.rootName = 'HOME';
        this.searchString = '';
        this.showGif = true;
        this.showJpg = true;
        this.showJxl = true;
        this.showPng = true;
        this.autohide = false;
        this.showText = false;
        this.showTree = true;
        this.forceHide = false;
        this.previewWidth = 100;
        this.previewHeight = 100;
        this.currentImage = '';
        this.currentIndex = 0;
        this.isFullScreen = false;
        this.allSettings = {
            appState: {
                zoomLevel: {}
            },
            buttons: {
                autoFileTags: {},
            }
        };
        this.appState = {};
        this.settingsButtonsGroups = settings_buttons_1.SettingsButtonsGroups;
        this.settingsButtons = settings_buttons_1.SettingsButtons;
        this.settingsModalOpen = true;
        this.settingTabToShow = 2;
        this.imagesPerRow = {
            view1: 5,
            view2: 5,
            view3: 5,
            view4: 5,
            view5: 5,
        };
        this.currentView = 'view1';
        this.options = {
            actionMapping: {
                mouse: {
                    click: function (tree, node, $event) {
                        // if (node.hasChildren) {
                        //   TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
                        // }
                        angular_tree_component_1.TREE_ACTIONS.FOCUS(tree, node, $event);
                        _this.toggleFolder(node.data.path);
                        console.log(node.data);
                    }
                }
            },
            nodeHeight: 30,
            levelPadding: 10
        };
    }
    HomeComponent.prototype.handleKeyboardEvent = function (event) {
        if (event.key === 'Escape' && this.currentImage !== '') {
            this.currentImage = '';
        }
        else if (event.key === 'ArrowLeft') {
            this.showPrevious();
        }
        else if (event.key === 'ArrowRight') {
            this.showNext();
        }
        else if (event.key === 'Escape' && this.isFullScreen) {
            this.toggleFullScreen();
        }
    };
    HomeComponent.prototype.showPrevious = function () {
        this.updatePreview(this.currentIndex - 1);
        console.log('previous');
    };
    HomeComponent.prototype.showNext = function () {
        this.updatePreview(this.currentIndex + 1);
        console.log('next');
    };
    HomeComponent.prototype.toggleFullScreen = function () {
        this.isFullScreen = !this.isFullScreen;
        this.electronService.ipcRenderer.send('full-screen-status', this.isFullScreen);
    };
    HomeComponent.prototype.toggleFolder = function (partialPath) {
        console.log(partialPath);
        this.partialPath = partialPath;
        this.cd.detectChanges();
    };
    HomeComponent.prototype.changeLanguage = function (language) {
        console.log(language);
        this.translate.use(language);
        this.translate.setTranslation(language, languages_1.LanguageLookup[language]);
        this.appState.language = language;
    };
    HomeComponent.prototype.toggleButton = function (button) {
        console.log(button);
        this.settingsButtons[button].toggled = !this.settingsButtons[button].toggled;
    };
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.translate.setDefaultLang('en');
        var English = require('../../../i18n/en.json');
        this.translate.setTranslation('en', English);
        this.electronService.ipcRenderer.send('just-started');
        this.electronService.ipcRenderer.on('settings-returning', function (event, data) {
            console.log('settings returning:');
            console.log(data);
        });
        this.electronService.ipcRenderer.on('input-folder-chosen', function (event, fullPath) {
            (0, electron_service_1.print)(fullPath);
            _this.rootName = fullPath.split('\\').pop();
        });
        this.electronService.ipcRenderer.on('files-coming-back', function (event, data) {
            (0, electron_service_1.print)(data);
            _this.processData(data);
        });
    };
    HomeComponent.prototype.ngAfterViewInit = function () {
        // this.openFolder();
    };
    HomeComponent.prototype.toggleTree = function (tree) {
        if (this.expanded) {
            tree.treeModel.collapseAll();
        }
        else {
            tree.treeModel.expandAll();
        }
        this.expanded = !this.expanded;
    };
    HomeComponent.prototype.processData = function (data) {
        var _this = this;
        this.allImages = data;
        var mapOfEverything = new Map();
        data.forEach(function (element) {
            if (mapOfEverything.has(element.partialPath)) {
                mapOfEverything.get(element.partialPath).push(element.fullPath);
            }
            else {
                mapOfEverything.set(element.partialPath, [element.fullPath]);
            }
        });
        // print(mapOfEverything);
        var paths = Array.from(mapOfEverything.keys());
        // print(paths);
        // thank you Nenad Vracar for the algorithm: https://stackoverflow.com/a/57344801/5017391
        var result = [];
        var level = { result: result };
        paths.forEach(function (path) {
            path.split('/').reduce(function (r, name) {
                if (!r[name]) {
                    r[name] = { result: [] };
                    r.result.push({
                        name: name,
                        path: path,
                        children: r[name].result
                    });
                }
                return r[name];
            }, level);
        });
        console.log(result);
        result[0].name = this.rootName;
        this.nodes = result;
        setTimeout(function () {
            _this.cd.detectChanges();
            _this.toggleTree(_this.tree);
            _this.cd.detectChanges();
        }, 1);
    };
    HomeComponent.prototype.openFolder = function () {
        (0, electron_service_1.print)('clicked');
        this.electronService.ipcRenderer.send('choose-input');
    };
    HomeComponent.prototype.filterTree = function (folderFilter) {
        console.log(folderFilter);
        this.tree.treeModel.filterNodes(folderFilter, true);
    };
    HomeComponent.prototype.exit = function () {
        this.electronService.ipcRenderer.send('close', this.allSettings);
    };
    HomeComponent.prototype.maximize = function () {
        if (this.appMaximized) {
            this.electronService.ipcRenderer.send('un-maximize');
            this.appMaximized = false;
        }
        else {
            this.electronService.ipcRenderer.send('maximize');
            this.appMaximized = true;
        }
    };
    HomeComponent.prototype.minimize = function () {
        this.electronService.ipcRenderer.send('minimize');
    };
    HomeComponent.prototype.changeView = function (view) {
        this.saveImagesPerRow();
        this.currentView = view;
        this.restoreImagesPerRow();
        if (view === 'view3' || view === 'view4' || view === 'view5') {
            this.computeDimensions();
        }
    };
    HomeComponent.prototype.increaseSize = function () {
        this.numOfColumns = this.numOfColumns - 1;
        this.computeDimensions();
    };
    HomeComponent.prototype.decreaseSize = function () {
        this.numOfColumns = this.numOfColumns + 1;
        this.computeDimensions();
    };
    HomeComponent.prototype.saveImagesPerRow = function () {
        this.imagesPerRow[this.currentView] = this.numOfColumns;
    };
    HomeComponent.prototype.restoreImagesPerRow = function () {
        this.numOfColumns = this.imagesPerRow[this.currentView];
    };
    HomeComponent.prototype.computeDimensions = function () {
        if (this.currentView === 'view3' || this.currentView === 'view4' || this.currentView === 'view5') {
            var galleryWidth = document.getElementById('the-gallery').getBoundingClientRect().width - 20; // 20 is scroll bar offset
            (0, electron_service_1.print)(galleryWidth);
            var previewWidth = galleryWidth / this.numOfColumns - 10; // 10 px is margin on side
            var previewHeight = 0;
            if (this.currentView === 'view4') {
                previewHeight = previewWidth * 2 / 3;
            }
            else {
                previewHeight = previewWidth * 3 / 2;
            }
            (0, electron_service_1.print)(previewWidth);
            (0, electron_service_1.print)(previewHeight);
            (0, electron_service_1.print)(this.currentView);
            this.previewWidth = previewWidth;
            this.previewHeight = previewHeight;
            this.cd.detectChanges();
        }
    };
    HomeComponent.prototype.showHideTree = function () {
        this.showTree = !this.showTree;
        this.forceHide = !this.forceHide;
    };
    HomeComponent.prototype.updatePreview = function (index) {
        if (index > this.imageService.images.length - 1) {
            index = 0;
        }
        else if (index < 0) {
            index = this.imageService.images.length - 1;
        }
        this.currentIndex = index;
        this.currentImage = this.imageService.images[index].fullPath;
        this.cd.detectChanges();
    };
    __decorate([
        (0, core_1.ViewChild)('tree'),
        __metadata("design:type", angular_tree_component_1.TreeNode)
    ], HomeComponent.prototype, "tree", void 0);
    __decorate([
        (0, core_1.HostListener)('document:keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], HomeComponent.prototype, "handleKeyboardEvent", null);
    HomeComponent = __decorate([
        (0, core_1.Component)({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss', './gallery.scss', '../settings.scss']
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef,
            image_service_1.ImageService,
            core_2.TranslateService,
            electron_service_1.ElectronService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map