import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import { open } from '@tauri-apps/plugin-dialog';
import { getCurrentWindow } from '@tauri-apps/api/window';

// import { TranslateService } from '@ngx-translate/core';

import { ImageService } from '../image.service';
import { FileService } from '../file.service';
import { UtilityService } from '../utility.service';

import { SettingsComponent } from '../settings/settings.component';
import { RibbonComponent } from '../ribbon/ribbon.component';

import { SubfolderPipe } from '../pipes/subfolder.pipe';
import { FiletypePipe } from '../pipes/filetype.pipe';
import { SearchPipe } from '../pipes/search.pipe';
import { SortPipe } from '../pipes/sort.pipe';
import { SavePipe } from '../pipes/save.pipe';

import { LanguageLookup, SupportedLanguage } from '../languages';
import { SettingsButtons, SettingsButtonsGroups, SettingsButtonKey } from './settings-buttons';

import type { AllowedExtension, AllowedView, AllSettings, ImageFile, RowNumbers, myTree } from '../interfaces';
import { DirViewComponent } from '../dir/dir.component';
import { LimitPipe } from '../pipes/limit.pipe';

@Component({
    selector: 'app-root',
    templateUrl: './home.component.html',
    imports: [ FormsModule, LimitPipe, DirViewComponent, SettingsComponent, RibbonComponent, SubfolderPipe, FiletypePipe, SearchPipe, SortPipe, SavePipe ],
    styleUrls: ['./home.component.scss', './gallery.scss', '../settings.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class HomeComponent implements OnInit, AfterViewInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.currentImage !== '') {
      this.currentImage = '';
    } else if (event.key === 'ArrowLeft') {
      this.showPrevious();
    } else if (event.key === 'ArrowRight') {
      this.showNext();
    } else if (event.key === 'Escape' && this.isFullScreen) {
      this.toggleFullScreen();
    }
  }

  showPrevious(): void {
    this.updatePreview(this.currentIndex - 1);
    console.log('previous');
  }

  showNext(): void {
    this.updatePreview(this.currentIndex + 1);
    console.log('next');
  }

  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;

    // FIX: full screen tauri
  }

  constructor(
    public cd: ChangeDetectorRef,
    public fileService: FileService,
    public imageService: ImageService,
    public utilityService: UtilityService,
  ) { }

  store: any;

  appWindow = getCurrentWindow();

  allImages: ImageFile[] = []; // every image in gallery is an object here
  dirData: myTree[]; // for the tree view in the sidebar

  allowedExtensions: AllowedExtension[] = ['png','jpg', 'jpeg', 'jxl'];
  appMaximized: boolean = false;
  expanded = false;
  numOfColumns: number = 5;
  partialPath: string = '/';
  rootName: string = 'HOME';
  searchString: string = '';

  inputFolder: string = '';

  showGif: boolean = true;
  showJpg: boolean = true;
  showJxl: boolean = true;
  showPng: boolean = true;

  autohide: boolean = false;
  showText: boolean = false;
  showTree: boolean = true;
  forceHide: boolean = false;

  previewWidth: number = 100;
  previewHeight: number = 100;

  currentImage: string = '';
  currentIndex: number = 0;

  isFullScreen: boolean = false;

  allSettings: AllSettings = {
    appState: {
      zoomLevel: {}
    },
    buttons: {
      autoFileTags: {} as any,
    }
  }

  appState: any = {};
  settingsButtonsGroups: any = SettingsButtonsGroups;
  settingsButtons: any = SettingsButtons;

  settingsModalOpen: boolean = false;

  settingTabToShow: number = 2;

  imagesPerRow: RowNumbers = {
    view1: 5,
    view2: 5,
    view3: 5,
    view4: 5,
    view5: 5,
  }

  currentView: AllowedView = 'view1';

  toggleFolder(partialPath: string) {
    console.log(partialPath);
    this.partialPath = partialPath;
    this.cd.detectChanges();
  }

  changeLanguage(language: SupportedLanguage): void {
    console.log(language);
    // this.translate.use(language);
    // this.translate.setTranslation(language, LanguageLookup[language]);
    this.appState.language = language;
  }

  toggleButton(button: SettingsButtonKey | string): void { // `| string` is temporary
    console.log(button);
    this.settingsButtons[button].toggled = !this.settingsButtons[button].toggled;
  }

  ngOnInit(): void {
    // this.translate.setDefaultLang('en');
    // const English    = require('../../../i18n/en.json');
    // this.translate.setTranslation('en', English);
  }

  ngAfterViewInit() {
    // this.handleSettings();
    this.openFolder();
  }

  async handleSettings() {
    const defaults = {
      'hi': 'hello world',
      'hihi': 'auto saved to store'
    };
    this.store = await load('store.json', { autoSave: true, defaults });
    const savedTheme = await this.store.get('theme');
    const hi = await this.store.get('hi');
    console.log('STORE:');
    console.log(savedTheme);
    console.log(hi);
  }

  toggleTree(): void {
    this.expanded = !this.expanded;
  }

  treeMessage(data: any) {
    console.log("Click received");
    console.log(data);

    this.partialPath = data.path;
  }

  async openFolder() {
    // const folderPath = "C:\\Users\\Boris\\Desktop\\images"

    const folderPath: string | null = await open({
      multiple: false,
      directory: true,
    });

    this.rootName = folderPath.split('\\').pop();

    this.inputFolder = folderPath;

    let response: string[];

    await invoke<any>("get_file_list", { "pathstring": folderPath }).then((fileList: string[]) => {
      response = fileList;
    });

    this.processImagesAndTree(response);
  }

  processImagesAndTree(list: string[]) {
    this.allImages = this.fileService.createImageFileObjects(this.filterOutNonImages(list), this.inputFolder);

    this.dirData = this.utilityService.processData(this.allImages, this.inputFolder);

    setTimeout(() => {
      this.cd.detectChanges();
    }, 1);
  }

  filterOutNonImages(list: string[]): string[] {
    return list.filter((filename: string) => filename.endsWith('.jpg')); // TODO - include more filetypes
  }

  filterTree(folderFilter: string): void {
    console.log("filtering not re-implemented yet");
    console.log(folderFilter);
  }

  exit(): void {
    this.store.set('theme', 'lol');
  }

  async maximize() {
    await this.appWindow.toggleMaximize();
  }

  async minimize() {
    await this.appWindow.minimize();
  }

  changeView(view: AllowedView): void {
    this.saveImagesPerRow();
    this.currentView = view;
    this.restoreImagesPerRow();
    if (view === 'view3' || view === 'view4' || view === 'view5') {
      this.computeDimensions();
    }
  }

  increaseSize(): void {
    this.numOfColumns = this.numOfColumns - 1;
    this.computeDimensions();
  }

  decreaseSize(): void {
    this.numOfColumns = this.numOfColumns + 1;
    this.computeDimensions();
  }

  saveImagesPerRow(): void {
    this.imagesPerRow[this.currentView] = this.numOfColumns;
  }

  restoreImagesPerRow(): void {
    this.numOfColumns = this.imagesPerRow[this.currentView];
  }

  computeDimensions(): void {
    if (this.currentView === 'view3' || this.currentView === 'view4' || this.currentView === 'view5') {
      const galleryWidth = document.getElementById('the-gallery').getBoundingClientRect().width - 20; // 20 is scroll bar offset

      console.log(galleryWidth);

      const previewWidth = galleryWidth / this.numOfColumns - 10; // 10 px is margin on side
      let previewHeight: number = 0;

      if (this.currentView === 'view4') {
        previewHeight = previewWidth * 2 / 3;
      } else {
        previewHeight = previewWidth * 3 / 2;
      }

      // console.log(previewWidth);
      // console.log(previewHeight);
      // console.log(this.currentView);

      this.previewWidth = previewWidth;
      this.previewHeight = previewHeight;

      this.cd.detectChanges();
    }
  }

  showHideTree(): void {
    this.showTree = !this.showTree;
    this.forceHide = !this.forceHide;
  }

  updatePreview(index: number): void {
    if (index > this.imageService.images.length - 1) {
      index = 0;
    } else if (index < 0) {
      index = this.imageService.images.length - 1;
    }
    this.currentIndex = index;

    console.log(this.imageService.images);

    this.currentImage = this.imageService.images[index].safePath;
    this.cd.detectChanges();
  }

}
