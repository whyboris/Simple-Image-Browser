import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { convertFileSrc } from '@tauri-apps/api/core';

// import { ITreeOptions, TreeComponent, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';

// import { TranslateService } from '@ngx-translate/core';

import { ImageService } from '../image.service';
import { FileService } from '../file.service';

import { SettingsComponent } from '../settings/settings.component';
import { RibbonComponent } from '../ribbon/ribbon.component';

import { LanguageLookup, SupportedLanguage } from '../languages';
import { SettingsButtons, SettingsButtonsGroups, SettingsButtonKey } from './settings-buttons';

import { AllSettings } from '../../interfaces/settings-object.interface';
import { TreeViewComponent } from '../tree/tree.component';

interface MyTreeNode {
  name: string;
  children?: MyTreeNode[];
}

export type AllowedExtension = 'jpg' | 'png' | 'gif' | 'jpeg' | 'jxl';

type AllowedView = 'view1' | 'view2' | 'view3' | 'view4' | 'view5';

interface RowNumbers {
  view1: number;
  view2: number;
  view3: number;
  view4: number;
  view5: number;
}

export interface ImageFile {
  extension: AllowedExtension;
  fullPath: string;
  name: string;
  partialPath: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './home.component.html',
    imports: [ FormsModule, SettingsComponent, RibbonComponent, TreeViewComponent ],
    styleUrls: ['./home.component.scss', './gallery.scss', '../settings.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class HomeComponent implements OnInit, AfterViewInit {

  tempTry = [
    {
      answer: "lol", child: [{ answer: "lol", child: [] }, { answer: "lol", child: [] }]
    },
    {
      answer: "lol", child: []
    },
    { answer: "lol", child: []

    }]

  // @ViewChild('tree') tree: TreeNode;

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
    public imageService: ImageService
  ) { }

  allImages: ImageFile[] = [];
  allowedExtensions: AllowedExtension[] = ['png','jpg', 'jxl'];
  appMaximized: boolean = false;
  expanded = false;
  nodes: MyTreeNode[] = [];
  numOfColumns: number = 5;
  partialPath: string = '/';
  rootName: string = 'HOME';
  searchString: string = '';

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

  // options: ITreeOptions = {
  //   actionMapping: {
  //     mouse: {
  //       click: (tree, node, $event) => {
  //         // if (node.hasChildren) {
  //         //   TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
  //         // }
  //         TREE_ACTIONS.FOCUS(tree, node, $event);
  //         this.toggleFolder(node.data.path);
  //         console.log(node.data);
  //       }
  //     }
  //   },
  //   nodeHeight: 30,
  //   levelPadding: 10
  // }

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

    // this.electronService.ipcRenderer.send('just-started');

    // this.electronService.ipcRenderer.on('settings-returning', (event, data: any) => {
    //   console.log('settings returning:');
    //   console.log(data);
    // });

    // this.electronService.ipcRenderer.on('input-folder-chosen', (event, fullPath: string) => {
    //   console.log(fullPath);
    //   this.rootName = fullPath.split('\\').pop();
    // });

    // this.electronService.ipcRenderer.on('files-coming-back', (event, data: ImageFile[]) => {
    //   console.log(data);
    //   this.processData(data);
    // });

  }

  ngAfterViewInit(): void {
    // this.openFolder();
  }

  toggleTree(/*tree: TreeComponent | TreeNode*/): void {
    // if (this.expanded) {
    //   tree.treeModel.collapseAll();
    // } else {
    //   tree.treeModel.expandAll();
    // }

    this.expanded = !this.expanded;
  }

  processData(data: ImageFile[]): void {

    this.allImages = data;

    const mapOfEverything: Map<string, string[]> = new Map();

    data.forEach(element => {
      if (mapOfEverything.has(element.partialPath)) {
        mapOfEverything.get(element.partialPath).push(element.fullPath);
      } else {
        mapOfEverything.set(element.partialPath, [element.fullPath]);
      }
    });

    // console.log(mapOfEverything);

    let paths = Array.from(mapOfEverything.keys());

    // console.log(paths);

    // thank you Nenad Vracar for the algorithm: https://stackoverflow.com/a/57344801/5017391
    let result = [];
    let level = { result };

    paths.forEach(path => {
      path.split('/').reduce((r, name) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({
            name: name,
            path: path,
            children: r[name].result })
        }

        return r[name];
      }, level)
    });

    console.log(result);

    result[0].name = this.rootName;

    this.nodes = result;

    console.log(this.nodes);

    setTimeout(() => {
      this.cd.detectChanges();
      // this.toggleTree(this.tree);
      this.cd.detectChanges();
    }, 1);

  }

  async openFolder() {
    console.log('clicked');
    const folderPath: string | null = await open({
      multiple: false,
      directory: true,
    });

    let response: string[];

    await invoke<any>("get_file_list", { "pathstring": folderPath }).then((fileList: string[]) => {
      response = fileList;
    });
    console.log(response);
    this.list_of_files_to_objects(response);
  }

  list_of_files_to_objects(list: string[]) {

    // temporary; filter more file types later
    const filtered: string[] = list.filter((filename: string) => filename.endsWith('.png'))

    let allFiles: ImageFile[] = [];

    for (const unparsed of filtered) {

      const parsed = this.fileService.parse(unparsed);

      const newItem: ImageFile = {
        extension: parsed.ext.replace('.', '') as AllowedExtension,
        fullPath: convertFileSrc(unparsed),
        name: parsed.base.replace(parsed.ext, ''),
        partialPath: '/' + parsed.name,
      };

      allFiles.push(newItem);
    }

    console.log(allFiles);

    this.processData(allFiles);
  }

  filterTree(folderFilter: string): void {
    console.log(folderFilter);
    // this.tree.treeModel.filterNodes(folderFilter, true);
  }

  exit(): void {
    // this.electronService.ipcRenderer.send('close', this.allSettings);
  }

  maximize(): void {
    if (this.appMaximized) {
      // this.electronService.ipcRenderer.send('un-maximize');
      this.appMaximized = false;
    } else {
      // this.electronService.ipcRenderer.send('maximize');
      this.appMaximized = true;
    }

  }

  minimize(): void {
    // this.electronService.ipcRenderer.send('minimize');
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

      console.log(previewWidth);
      console.log(previewHeight);
      console.log(this.currentView);

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
    this.currentImage = this.imageService.images[index].fullPath;
    this.cd.detectChanges();
  }

}
