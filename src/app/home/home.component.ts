import { Component, OnInit } from '@angular/core';
import { ITreeOptions } from '@circlon/angular-tree-component';
import { ElectronService, print } from '../electron.service';

import { MyTreeOptions } from './tree-options';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface ImageFile {
  fullPath: string;
  name: string;
  partialPath: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './gallery.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public electronService: ElectronService,
  ) { }

  expanded = false;
  allImages: ImageFile[] = [];
  nodes: TreeNode[] = [];
  showText: boolean = true;
  searchString: string = '';
  numOfColumns: number = 5;
  rootName: string = 'HOME';

  options: ITreeOptions = MyTreeOptions;

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

  }

  openFolder(): void {
    print('clicked');
    this.electronService.ipcRenderer.send('choose-input');
  }

}
