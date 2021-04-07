import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ITreeOptions, TreeComponent, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';

import { ElectronService, print } from '../electron.service';
import { ImageService } from '../image.service';

import { AllSettings } from '../../interfaces/settings-object.interface';

interface MyTreeNode {
  name: string;
  children?: MyTreeNode[];
}

export type AllowedExtension = 'jpg' | 'png' | 'gif' | 'jpeg';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './gallery.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('tree') tree: TreeNode;

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
    this.electronService.ipcRenderer.send('full-screen-status', this.isFullScreen);
  }

  constructor(
    public cd: ChangeDetectorRef,
    public imageService: ImageService,
    public electronService: ElectronService,
  ) { }

  allImages: ImageFile[] = [];
  allowedExtensions: AllowedExtension[] = ['png','jpg'];
  appMaximized: boolean = false;
  expanded = false;
  nodes: MyTreeNode[] = [];
  numOfColumns: number = 5;
  partialPath: string = '/';
  rootName: string = 'HOME';
  searchString: string = '';

  showGif: boolean = true;
  showJpg: boolean = true;
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
    hello: 'hi',
  }

  imagesPerRow: RowNumbers = {
    view1: 5,
    view2: 5,
    view3: 5,
    view4: 5,
    view5: 5,
  }

  currentView: AllowedView = 'view1';

  options: ITreeOptions = {
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          // if (node.hasChildren) {
          //   TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          // }
          TREE_ACTIONS.FOCUS(tree, node, $event);
          this.toggleFolder(node.data.path);
          console.log(node.data);
        }
      }
    },
    nodeHeight: 30,
    levelPadding: 10
  }

  toggleFolder(partialPath: string) {
    console.log(partialPath);
    this.partialPath = partialPath;
    this.cd.detectChanges();
  }

  ngOnInit(): void {

    this.electronService.ipcRenderer.send('just-started');

    this.electronService.ipcRenderer.on('settings-returning', (event, data: any) => {
      console.log('settings returning:');
      console.log(data);
    });

    this.electronService.ipcRenderer.on('input-folder-chosen', (event, fullPath: string) => {
      print(fullPath);
      this.rootName = fullPath.split('\\').pop();
    });

    this.electronService.ipcRenderer.on('files-coming-back', (event, data: ImageFile[]) => {
      // print(data);
      this.processData(data);
    });

  }

  ngAfterViewInit(): void {
    this.openFolder();
  }

  toggleTree(tree: TreeComponent | TreeNode): void {
    if (this.expanded) {
      tree.treeModel.collapseAll();
    } else {
      tree.treeModel.expandAll();
    }

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

    // print(mapOfEverything);

    let paths = Array.from(mapOfEverything.keys());

    // print(paths);

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

    // console.log(result);

    result[0].name = this.rootName;

    this.nodes = result;

    setTimeout(() => {
      this.cd.detectChanges();
      this.toggleTree(this.tree);
      this.cd.detectChanges();
    }, 1);

  }

  openFolder(): void {
    print('clicked');
    this.electronService.ipcRenderer.send('choose-input');
  }

  filterTree(folderFilter: string): void {
    console.log(folderFilter);
    this.tree.treeModel.filterNodes(folderFilter, true);
  }

  exit(): void {
    this.electronService.ipcRenderer.send('close', this.allSettings);
  }

  maximize(): void {
    if (this.appMaximized) {
      this.electronService.ipcRenderer.send('un-maximize');
      this.appMaximized = false;
    } else {
      this.electronService.ipcRenderer.send('maximize');
      this.appMaximized = true;
    }

  }

  minimize(): void {
    this.electronService.ipcRenderer.send('minimize');
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

      print(galleryWidth);

      const previewWidth = galleryWidth / this.numOfColumns - 10; // 10 px is margin on side
      let previewHeight: number = 0;

      if (this.currentView === 'view4') {
        previewHeight = previewWidth * 2 / 3;
      } else {
        previewHeight = previewWidth * 3 / 2;
      }

      print(previewWidth);
      print(previewHeight);
      print(this.currentView);

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
