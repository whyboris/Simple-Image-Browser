import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { ElectronService, print } from '../electron.service';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export type AllowedExtension = 'jpg' | 'png' | 'gif';

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

  @ViewChild('tree') tree;

  constructor(
    public cd: ChangeDetectorRef,
    public electronService: ElectronService,
  ) { }

  allImages: ImageFile[] = [];
  allowedExtensions: AllowedExtension[] = ['png','jpg'];
  expanded = false;
  nodes: TreeNode[] = [];
  numOfColumns: number = 5;
  partialPath: string = '/';
  rootName: string = 'HOME';
  searchString: string = '';
  showText: boolean = true;
  showPng: boolean = true;
  showGif: boolean = true;
  showJpg: boolean = true;

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

    this.electronService.ipcRenderer.on('input-folder-chosen', (event, fullPath: string) => {
      print(fullPath);
      this.rootName = fullPath.split('\\').pop();
    });

    this.electronService.ipcRenderer.on('files-coming-back', (event, data: ImageFile[]) => {
      print(data);
      this.processData(data);
    });

  }

  ngAfterViewInit(): void {
    this.openFolder();
  }

  toggleTree(tree) {
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

    print(mapOfEverything);

    let paths = Array.from(mapOfEverything.keys());

    print(paths);

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

    console.log(result)

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
    this.electronService.ipcRenderer.send('close');
  }

}
