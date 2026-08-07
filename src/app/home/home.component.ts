import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { convertFileSrc } from '@tauri-apps/api/core';
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import { open } from '@tauri-apps/plugin-dialog';

// import { ITreeOptions, TreeComponent, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';
// import { TranslateService } from '@ngx-translate/core';

import { ImageService } from '../image.service';
import { FileService } from '../file.service';

import { SettingsComponent } from '../settings/settings.component';
import { RibbonComponent } from '../ribbon/ribbon.component';
import { TreeViewComponent } from '../tree/tree.component';

import { SubfolderPipe } from '../pipes/subfolder.pipe';
import { FiletypePipe } from '../pipes/filetype.pipe';
import { SearchPipe } from '../pipes/search.pipe';
import { SortPipe } from '../pipes/sort.pipe';
import { SavePipe } from '../pipes/save.pipe';

import { LanguageLookup, SupportedLanguage } from '../languages';
import { SettingsButtons, SettingsButtonsGroups, SettingsButtonKey } from './settings-buttons';

import type { AllowedExtension, AllowedView, AllSettings, ImageFile, RowNumbers, MyTreeNode } from '../interfaces';

@Component({
    selector: 'app-root',
    templateUrl: './home.component.html',
    imports: [ FormsModule, SettingsComponent, RibbonComponent, TreeViewComponent, SubfolderPipe, FiletypePipe, SearchPipe, SortPipe, SavePipe ],
    styleUrls: ['./home.component.scss', './gallery.scss', '../settings.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class HomeComponent implements OnInit, AfterViewInit {

  treeData: MyTreeNode[] = [
    {
      name: "lol1", children: [{ name: "lol2", children: [] }, { name: "lol3", children: [] }]
    },
    {
      name: "lol4", children: []
    },
    { name: "lol5", children: []

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

  store: any;

  allImages: ImageFile[] = [];
  allowedExtensions: AllowedExtension[] = ['png','jpg', 'jpeg', 'jxl'];
  appMaximized: boolean = false;
  expanded = false;
  nodes: MyTreeNode[] = [];
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

    console.log(data);

    const mapOfEverything: Map<string, string[]> = new Map();

    data.forEach(element => {
      if (mapOfEverything.has(element.partialPath)) {
        mapOfEverything.get(element.partialPath).push(element.fullPath);
      } else {
        mapOfEverything.set(element.partialPath, [element.fullPath]);
      }
    });

    console.log(mapOfEverything);

    let paths = Array.from(mapOfEverything.keys());

    console.log("HELLO");

    console.log(paths);

    const onlyFolders = paths.map((el) => el.substring(0, el.lastIndexOf("/")));

    console.log(onlyFolders);

    const uniqueFolders = [...new Set(onlyFolders)];

    console.log(uniqueFolders);


    var obj = {}
    uniqueFolders.forEach(function(path) {
      path.split('/').reduce(function(r, e) {

        return r[e] || (r[e] = {})
      }, obj)
    })

    console.log(obj)

    // thank you Nenad Vracar for the algorithm: https://stackoverflow.com/a/57344801/5017391
    let result: MyTreeNode[] = [];
    let level = { result };

    uniqueFolders.forEach(path => {
      path.split('/').reduce((r, name) => {

        console.log(r, name);

        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({
            name: name,
            partial: path,
            children: r[name].result })
        }

        return r[name];
      }, level)
    });

    console.log("FINAL");
    console.log(result);

    result[0].name = this.rootName;

    this.nodes = result;

    // console.log(this.nodes);

    this.treeData = this.nodes as MyTreeNode[];

    // console.log(this.treeData);

    setTimeout(() => {
      this.cd.detectChanges();
      // this.toggleTree(this.tree);
      this.cd.detectChanges();
    }, 1);

  }

  treeMessage(data: any) {
    console.log("Click received");
    console.log(data);

    this.partialPath = data.partial
  }

  async openFolder() {

    console.log('temp hardcoded - remove before git commit');
    const folderPath = "C:\\Users\\Boris\\Desktop\\images"

    // const folderPath: string | null = await open({
    //   multiple: false,
    //   directory: true,
    // });

    console.log(folderPath);

    this.rootName = folderPath.split('\\').pop();

    this.inputFolder = folderPath;

    console.log(this.rootName);

    let response: string[];

    await invoke<any>("get_file_list", { "pathstring": folderPath }).then((fileList: string[]) => {
      response = fileList;
    });
    console.log(response);
    this.list_of_files_to_objects(response);
  }


  list_of_files_to_objects(list: string[]) {

    // temporary; filter more file types later
    const filtered: string[] = list.filter((filename: string) => filename.endsWith('.jpg'))

    console.log(filtered);

    let allFiles: ImageFile[] = [];

    for (const unparsed of filtered) {

      const parsed = this.fileService.parse(unparsed);

      //  const partial: string = path.relative(inputDir, parsed.dir).replace(/\\/g, '/');
      // partial === partialPath
      // ##############
      console.log(this.inputFolder);

      let partial = unparsed.replace(this.inputFolder, "").trim();

      const newItem: ImageFile = {
        extension: parsed.ext.replace('.', '') as AllowedExtension,
        fullPath: unparsed,
        safePath: convertFileSrc(unparsed),
        name: parsed.base.replace(parsed.ext, ''),
        partialPath: partial.replace(/\\/g, '/'),
        folderPath: partial.replace(/\\/g, '/').replace(parsed.base, "")
      };

      allFiles.push(newItem);
    }

    console.log(allFiles);

    this.processData(allFiles);
  }

  filterTree(folderFilter: string): void {
    console.log("filtering not re-implemented yet");
    console.log(folderFilter);
    // this.tree.treeModel.filterNodes(folderFilter, true);
  }

  exit(): void {
    this.store.set('theme', 'lol');
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
